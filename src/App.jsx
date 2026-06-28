import { useState, useEffect } from 'react';
import DrawingCanvas from './components/DrawingCanvas/DrawingCanvas';
import Prediction from './components/Prediction/Prediction';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import { useModel } from './hooks/useModel';
import Button from './components/Button/Button';
import './App.css';


function App() {
  const { loadModel, onPredict, status, error, prediction, confidence } = useModel();

  return (
    <div className="app">
      <Header />
      <Button onClick={loadModel} disabled={status === 'loading' || status === 'ready'}>
        {status === 'loading' ? 'Cargando modelo...' : status === 'ready' ? 'Modelo Cargado' : 'Cargar modelo'}
      </Button>
      <div className="main-container">
        <DrawingCanvas onPredict={onPredict} />
        <Prediction prediction={prediction} confidence={confidence} />
      </div>

      <Footer />
    </div>
  );
}

export default App;