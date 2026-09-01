import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  getDocFromServer,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from 'firebase/auth';
import { Product, Order, AuthUser } from './types';
import { INITIAL_PRODUCTS } from './data/initialData';

// User-provided Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDAB_JZylMLwTmsQ_HAQW7uXYdzDkE7crc",
  authDomain: "my-website-a696f.firebaseapp.com",
  projectId: "my-website-a696f",
  storageBucket: "my-website-a696f.firebasestorage.app",
  messagingSenderId: "982497506146",
  appId: "1:982497506146:web:80911274522d0c7b93b23b",
  measurementId: "G-9RMFEQ91TQ"
};

// Initialize Firebase App singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

export function mapFirebaseUser(user: User | null): AuthUser | null {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email?.split('@')[0] || 'Member',
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous,
  };
}

export async function loginWithGoogle(): Promise<AuthUser> {
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    const mapped = mapFirebaseUser(result.user);
    if (!mapped) throw new Error('Could not retrieve user profile');
    return mapped;
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
}

export async function loginWithEmail(email: string, pass: string): Promise<AuthUser> {
  try {
    const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
    const mapped = mapFirebaseUser(result.user);
    if (!mapped) throw new Error('Could not retrieve user profile');
    return mapped;
  } catch (error) {
    console.error('Email Sign In Error:', error);
    throw error;
  }
}

export async function registerWithEmail(email: string, pass: string, name?: string): Promise<AuthUser> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (name?.trim() && result.user) {
      await updateProfile(result.user, { displayName: name.trim() });
    }
    const mapped = mapFirebaseUser(result.user);
    if (!mapped) throw new Error('Could not retrieve user profile');
    return mapped;
  } catch (error) {
    console.error('Email Registration Error:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout Error:', error);
    throw error;
  }
}

export function subscribeToAuth(onUserChange: (user: AuthUser | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    onUserChange(mapFirebaseUser(user));
  });
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  timestamp: string;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    timestamp: new Date().toISOString(),
  };
  console.warn('Firestore Operation Notification:', JSON.stringify(errInfo));
}

// Test Connection Helper
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is connecting...");
    }
    return false;
  }
}

// ==========================================
// PRODUCTS FIRESTORE OPERATIONS
// ==========================================

export async function saveProductToFirestore(product: Product): Promise<void> {
  const path = `products/${product.id}`;
  try {
    const cleanProduct = {
      ...product,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'products', product.id), cleanProduct);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const path = `products/${productId}`;
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
  }
}

export async function seedDefaultProductsIfEmpty(): Promise<void> {
  try {
    const snap = await getDocs(collection(db, 'products'));
    const existingMap = new Map(snap.docs.map((d) => [d.id, d.data()]));
    
    // Seed any product from INITIAL_PRODUCTS that doesn't exist in Firestore
    for (const prod of INITIAL_PRODUCTS) {
      if (!existingMap.has(prod.id)) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'products');
  }
}

export function mergeProductsWithDefaults(liveList: Product[]): Product[] {
  const map = new Map<string, Product>();
  // 1. Put all default items
  for (const p of INITIAL_PRODUCTS) {
    map.set(p.id, p);
  }
  // 2. Put live / saved products (which might contain edits or new items)
  for (const p of liveList) {
    map.set(p.id, p);
  }
  return Array.from(map.values());
}

export function subscribeToProducts(
  onSuccess: (products: Product[]) => void,
  onError?: (err: Error) => void
) {
  const path = 'products';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      if (!snapshot.empty) {
        const prods: Product[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as Product;
          prods.push({ ...data, id: d.id });
        });
        onSuccess(mergeProductsWithDefaults(prods));
      } else {
        onSuccess(INITIAL_PRODUCTS);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      if (onError) onError(error);
    }
  );
}

// ==========================================
// INQUIRIES & CHAT FIRESTORE OPERATIONS
// ==========================================

export interface FirestoreInquiry {
  id: string;
  userName: string;
  topic: string;
  message: string;
  createdAt: string;
  source: 'whatsapp_composer' | 'contact_form' | 'chat';
  status: 'new' | 'viewed' | 'resolved';
}

export async function saveInquiryToFirestore(inquiry: {
  userName: string;
  topic: string;
  message: string;
  source?: 'whatsapp_composer' | 'contact_form' | 'chat';
}): Promise<string> {
  const id = `inq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const path = `inquiries/${id}`;
  try {
    const payload: FirestoreInquiry = {
      id,
      userName: inquiry.userName.trim() || 'Anonymous Customer',
      topic: inquiry.topic || 'General Inquiry',
      message: inquiry.message.trim(),
      createdAt: new Date().toISOString(),
      source: inquiry.source || 'whatsapp_composer',
      status: 'new',
    };
    await setDoc(doc(db, 'inquiries', id), payload);
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    throw err;
  }
}

// ==========================================
// ORDERS FIRESTORE OPERATIONS
// ==========================================

export async function saveOrderToFirestore(order: Order): Promise<void> {
  const path = `orders/${order.id}`;
  try {
    const payload = {
      ...order,
      savedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'orders', order.id), payload);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    throw err;
  }
}
