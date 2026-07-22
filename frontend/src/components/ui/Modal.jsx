import { FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import IconButton from "./IconButton";

export default function Modal({ open, title, children, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full max-w-lg rounded-xl bg-white shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-950">{title}</h2>
          <IconButton icon={FiX} label="Cerrar" variant="ghost" onClick={onClose} />
        </header>
        <div className="p-5">{children}</div>
      </motion.div>
    </div>
  );
}
