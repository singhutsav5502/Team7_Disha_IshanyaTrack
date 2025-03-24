import React from 'react';

interface DeleteConfirmationModalProps {
  showModal: boolean;
  hideModal: () => void;
  confirmModal: () => void;
  message: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  showModal,
  hideModal,
  confirmModal,
  message
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Delete Confirmation</h3>
        <div className="alert alert-error mb-4">
          <p>{message}</p>
        </div>
        <div className="flex justify-end space-x-2">
          <button 
            className="btn btn-outline" 
            onClick={hideModal}
          >
            Cancel
          </button>
          <button 
            className="btn btn-error" 
            onClick={confirmModal}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
