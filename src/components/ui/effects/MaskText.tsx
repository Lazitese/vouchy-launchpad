import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MaskTextProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const MaskText = ({ children, delay = 0, className = "" }: MaskTextProps) => {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default MaskText;
