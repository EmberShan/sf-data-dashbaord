import React from 'react';
import ProductCard from './ProductCard';

// Modal.jsx
// Modal dialog for displaying detailed product info for a selected chart group.
const Modal = ({ open, onClose, label, products, viewBy, groupByProductLine }) => {
  if (!open) return null;
  const colorGroup = viewBy === 'color' ? label : null;
  const grouped = groupByProductLine(products, colorGroup);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20" onClick={onClose}>
      <div
        className="bg-white rounded-xl border border-[#DDE9F3] p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto relative shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div
          className="absolute p-4 top-4 right-4 text-[#A3B3BF] text-2xl font-bold hover:opacity-70 cursor-pointer select-none"
          onClick={onClose}
          role="button"
          tabIndex={0}
          aria-label="Close modal"
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClose(); }}
        >
          <img src="/close.svg" alt="Close" className="w-7 h-7" style={{ filter: 'invert(56%) sepia(7%) saturate(370%) hue-rotate(169deg) brightness(93%) contrast(87%)' }} />
        </div>
        <div className="text-[#215273] font-semibold text-lg mb-4">{label}</div>
        {Object.keys(grouped).length === 0 ? (
          <div className="text-[#A3B3BF]">No products in this group.</div>
        ) : (
          Object.entries(grouped).map(([line, prods]) => (
            <div key={line} className="mb-8 bg-[#F9FBFC] p-4">
              <div className="text-[#3398FF] font-semibold text-base mb-2">{line}</div>
              <div className="flex flex-wrap gap-2">
                {prods.map((prod) => (
                  <ProductCard key={prod.product_id} product={prod} season={prod.season} productLine={line} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Modal; 