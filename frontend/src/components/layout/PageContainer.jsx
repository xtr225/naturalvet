import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export default function PageContainer({ children, className }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </motion.main>
  );
}
