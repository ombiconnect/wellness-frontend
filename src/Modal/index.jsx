import { motion } from "framer-motion";

const Modal = ({ isOpen, onClose, title, body, footer, size = "max-w-lg" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`bg-white rounded-2xl shadow-lg w-full ${size} max-h-[80vh] flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-3">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl font-bold cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="px-6 py-4 overflow-y-auto flex-1">{body}</div>

        {/* Footer */}
        {footer && <div className=" px-6 py-3">{footer}</div>}
      </motion.div>
    </div>
  );
};

export default Modal;
