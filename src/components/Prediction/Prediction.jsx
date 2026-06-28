import { motion } from 'framer-motion';
import styles from './Prediction.module.css'

const Prediction = ({ prediction, confidence }) => {
  return (
    <motion.div
      className={styles.container}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className={styles.label}>Predicción:</h2>
      <p className={styles.digit}>{prediction}</p>
      <div>
        <div className={styles.bar}>
          <div
            className={styles.fill}
            style={{ width: `${confidence * 100}%` }}
          />
        </div>
        <p>Confianza: {(confidence * 100).toFixed(1)}%</p>
      </div>
    </motion.div>
  );
};

export default Prediction;