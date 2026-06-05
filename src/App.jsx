import { useState, useEffect } from 'react';
import DrawingCanvas from './components/DrawingCanvas';
import Prediction from './components/Prediction';
import { loadModel, predictDigit } from './utils/modelLoader';
import './App.css';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const initModel = async () => {
      try {
        const loadedModel = await loadModel();
        setModel(loadedModel);
      } catch (error) {
        console.error('Fatal error initializing model:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initModel();
  }, []);

  const handlePredict = async (imageData) => {
    if(imageData === null) {
      setPrediction(null);
      setConfidence(0);
      return;
    }
    if (!imageData || !model) return;
    try {
      const result = await predictDigit(model, imageData);
      console.log('Predicción:', result);
      setPrediction(result.digit);
      setConfidence(result.confidence);
    } catch (error) {
      console.error('Error en predicción:', error);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>🔢 Clasificador de Dígitos</h1>
        <p>Dibuja un número (0-9) y la red neuronal lo reconocerá</p>
      </header>
      
      <div className="main-container">
        <DrawingCanvas onPredict={handlePredict} />
        <Prediction prediction={prediction} confidence={confidence} />
      </div>
      
      <footer>
        <p>🧠 Red neuronal entrenada con el dataset MNIST | TensorFlow.js</p>
        <p className="small">(Dibuja en el recuadro negro con el mouse/dedo)</p>
      </footer>
    </div>
  );
}

export default App;