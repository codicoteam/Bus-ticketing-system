import { motion } from "framer-motion";

export default function AuthLayout({ children }) {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.98 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {children}
      </motion.div>
    </div>
  );
}
