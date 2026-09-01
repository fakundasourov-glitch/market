import React, { useState } from 'react';

interface FooterProps {
  onOpenFaq?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenFaq }) => {
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null);

  const showPrivacy = (e: React.MouseEvent) => {
    e.preventDefault();
    setModalContent({
      title: 'Privacy Policy',
      body: 'At MinimalistShop, we respect your privacy. Orders and customer details transmitted via WhatsApp are handled securely and solely for the fulfillment and shipping of your curated home goods.',
    });
  };

  const showTerms = (e: React.MouseEvent) => {
    e.preventDefault();
    setModalContent({
      title: 'Terms of Service',
      body: 'All items are inspected prior to dispatch. We support 30-day standard returns on non-customized items. Order confirmations and receipt tracking are issued directly via WhatsApp.',
    });
  };

  return (
    <>
      <footer className="bg-white font-['Inter',sans-serif] text-sm py-8 border-t border-[#e1e3e4] mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 w-full max-w-[1200px] mx-auto gap-4">
          <div className="text-[#5e5e5e] text-xs">
            © 2024 MinimalistShop. Powered by WhatsApp.
          </div>
          <nav className="flex gap-6 text-xs text-[#5e5e5e]">
            <a
              href="#privacy"
              onClick={showPrivacy}
              className="hover:underline transition-all hover:text-[#191c1d]"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              onClick={showTerms}
              className="hover:underline transition-all hover:text-[#191c1d]"
            >
              Terms of Service
            </a>
            <a
              href="#faq"
              onClick={(e) => {
                e.preventDefault();
                if (onOpenFaq) onOpenFaq();
              }}
              className="hover:underline transition-all hover:text-[#191c1d]"
            >
              FAQ
            </a>
          </nav>
        </div>
      </footer>

      {/* Info modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-[#EEEEEE] max-w-md w-full p-6 shadow-xl">
            <h3 className="text-base font-bold text-[#191c1d] mb-2">{modalContent.title}</h3>
            <p className="text-xs text-[#3c4a3d] leading-relaxed mb-6">{modalContent.body}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setModalContent(null)}
                className="bg-[#191c1d] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#333333]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
