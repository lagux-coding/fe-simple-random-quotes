import { motion } from "motion/react";
import { useEffect, useState } from "react";

const Loading = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 flex items-center justify-center bg-opacity-50">
      <span className="loading loading-dots loading-xl"></span>
    </motion.div>
  );
};

export default Loading;
