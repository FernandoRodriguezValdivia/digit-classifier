import { useState, useEffect } from 'react';
import DrawingCanvas from './components/DrawingCanvas/DrawingCanvas';
import Prediction from './components/Prediction/Prediction';
import { loadModel, predictDigit } from './utils/modelLoader';
import './App.css';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';


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
    if (imageData === null) {
      setPrediction(null);
      setConfidence(0);
      return;
    }
    if (!imageData || !model) return;
    try {
      const result = await predictDigit(model, imageData);
      setPrediction(result.digit);
      setConfidence(result.confidence);
    } catch (error) {
      console.error('Error en predicción:', error);
    }
  };

  return (
    <div className="app">
      <Header />
      <div className="main-container">
        <DrawingCanvas onPredict={handlePredict} />
        <Prediction prediction={prediction} confidence={confidence} />
      </div>

      <Footer />
    </div>
  );
}

export default App;