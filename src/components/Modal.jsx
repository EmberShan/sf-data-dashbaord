import React from 'react';

// Mapping from product keys to user-friendly column headers
const COLUMN_MAP = {
  image_url: 'Image',
  product_id: 'Style Number',
  margin: 'Margin',
  cost: 'Cost',
  price: 'Price',
  season: 'Season',
  product_line: 'Line',
  quantity_sold: 'Quantities',
  name: 'Name',
  color: 'Color',
  fabric: 'Fabric',
  type: 'Type',
  buyer: 'Buyer',
  date_added: 'Date Added',
  available_sizes: 'Sizes',
};

// Keys to show in the table and their order
const COLUMN_ORDER = [
  'image_url',
  'product_id',
  'margin',
  'cost',
  'season',
  'product_line',
  'quantity_sold',
];

function getMargin(product) {
  if (product.price && product.cost) {
    return Math.round(((product.price - product.cost) / product.price) * 100);
  }
  return '';
}

function formatValue(key, value, product) {
  if (key === 'image_url') {
    return (
      <img
        src={value.replace('public/', '/')}
        alt={product.name || product.product_id}
        className="w-14 h-14 object-contain mx-auto"
        style={{ background: '#F9FBFC', borderRadius: 6 }}
      />
    );
  }
  if (key === 'margin') {
    return product.price && product.cost ? `${getMargin(product)}%` : '';
  }
  if (key === 'cost' || key === 'price') {
    return value ? `$${Number(value).toLocaleString()}` : '';
  }
  if (key === 'quantity_sold') {
    return value ? Number(value).toLocaleString() : '';
  }
  if (key === 'season') {
    return value ? value.replace('Spring', 'SP').replace('Summer', 'SU').replace('Fall', 'FW').replace('Winter', 'FW').replace('Holiday', 'HOL') : '';
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  return value;
}

const Modal = ({ open, onClose, label, products }) => {
  if (!open) return null;
  if (!products || products.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20" onClick={onClose}>
        <div className="bg-white rounded-xl border border-light-border p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto relative shadow-xl" onClick={e => e.stopPropagation()}>
          <div className="absolute p-4 top-4 right-4 text-[#A3B3BF] text-2xl font-bold hover:opacity-70 cursor-pointer select-none" onClick={onClose} role="button" tabIndex={0} aria-label="Close modal" onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClose(); }}>
            <img src="/close.svg" alt="Close" className="w-7 h-7" style={{ filter: 'invert(56%) sepia(7%) saturate(370%) hue-rotate(169deg) brightness(93%) contrast(87%)' }} />
          </div>
          <div className="text-text-color font-semibold text-lg mb-4">{label}</div>
          <div className="text-[#A3B3BF]">No products in this group.</div>
        </div>
      </div>
    );
  }

  // Determine columns to show based on COLUMN_ORDER and available keys
  const first = products[0];
  const columns = COLUMN_ORDER.filter(key => key in first);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20" onClick={onClose}>
      <div className="bg-white rounded-xl border border-light-border p-8 max-w-5xl w-full max-h-[80vh] overflow-x-auto overflow-y-auto relative shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="absolute p-4 top-4 right-4 text-[#A3B3BF] text-2xl font-bold hover:opacity-70 cursor-pointer select-none" onClick={onClose} role="button" tabIndex={0} aria-label="Close modal" onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClose(); }}>
          <img src="/close.svg" alt="Close" className="w-7 h-7" style={{ filter: 'invert(56%) sepia(7%) saturate(370%) hue-rotate(169deg) brightness(93%) contrast(87%)' }} />
        </div>
        <div className="text-text-color font-semibold text-lg mb-4">{label}</div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-background-color">
                {columns.map(key => (
                  <th key={key} className="px-4 py-2 text-text-color font-semibold text-base text-left whitespace-nowrap border-b border-[#E9EDEF]">{COLUMN_MAP[key] || key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((prod, idx) => (
                <tr key={prod.product_id || idx} className="bg-background-color hover:bg-[#F5F8FA]">
                  {columns.map(key => (
                    <td key={key} className="px-4 py-2 text-text-color text-base border-b border-[#E9EDEF] align-middle whitespace-nowrap">
                      {formatValue(key, key === 'margin' ? getMargin(prod) : prod[key], prod)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Modal; 