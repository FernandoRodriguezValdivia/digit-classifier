import { motion } from 'framer-motion';

const Prediction = ({ prediction, confidence }) => {
  return (
    <motion.div 
      className="prediction-card"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2>Predicción:</h2>
      <div className="digit">{prediction}</div>
      <div className="confidence">
        <div className="confidence-bar">
          <div 
            className="confidence-fill" 
            style={{ width: `${confidence * 100}%` }}
          />
        </div>
        <p>Confianza: {(confidence * 100).toFixed(1)}%</p>
      </div>
    </motion.div>
  );
};

export default Prediction;