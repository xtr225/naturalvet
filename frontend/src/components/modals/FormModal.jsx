import Modal from "../ui/Modal";

export default function FormModal({ open, title, children, onClose }) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      {children}
    </Modal>
  );
}
