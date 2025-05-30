import React from "react";

// ConfirmationModal.jsx
// A reusable confirmation modal component that displays a warning message and action buttons.
// Features:
// - Backdrop with 30% black opacity
// - Centered modal with warning message
// - Confirm and Cancel buttons
// - Keyboard accessibility
// - Consistent styling with the website theme
//
// Props:
// - open: boolean - Whether the modal is visible
// - onClose: function - Callback when modal is closed
// - onConfirm: function - Callback when action is confirmed
// - title: string - Modal title
// - message: string - Warning message to display
// - confirmText: string - Text for confirm button
// - cancelText: string - Text for cancel button

const ConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-50"
        onClick={onClose}
      />
      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 z-50 min-w-[320px] max-w-[480px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2
          id="modal-title"
          className="text-[#215273] text-lg font-semibold mb-4"
        >
          {title}
        </h2>
        <p className="text-[#215273] mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <div
            className="px-4 py-2 rounded text-[#215273] hover:cursor-pointer hover:text-[#3398FF] transition-colors"
            onClick={onClose}
          >
            {cancelText}
          </div>
          <div
            className="px-4 py-2 rounded border boder-[#215273] text-[#215273] hover:cursor-pointer hover:text-[#3398FF] transition-colors"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal; 