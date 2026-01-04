import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface MaskRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const MaskReveal = ({ children, delay = 0, className = "" }: MaskRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={isInView ? { clipPath: "inset(0 0 0% 0)" } : {}}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export default MaskReveal;
