import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import styles from './DeleteConfirmationModal.module.css';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.warningIcon}>
                    <FaExclamationTriangle />
                </div>
                <h3>Confirm Delete</h3>
                <p>Are you sure you want to delete {itemName}? This action cannot be undone.</p>
                <div className={styles.buttonGroup}>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        Cancel
                    </button>
                    <button className={styles.deleteBtn} onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
