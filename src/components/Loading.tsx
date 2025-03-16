import { motion } from "motion/react";

const Loading = () => {
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
