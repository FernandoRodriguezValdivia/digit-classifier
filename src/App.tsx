import DrawingCanvas from './components/DrawingCanvas/DrawingCanvas';
import Prediction from './components/Prediction/Prediction';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import { useModel } from './hooks/useModel';
import Button from './components/Button/Button';
import './App.css';


function App() {
  const { loadModel, onPredict, status, prediction, confidence, type } = useModel();

  return (
    <div className="app">
      <Header />
      <div className="button-status-container">
        {
          status === 'ready' ? <p className="status">Modelo cargado por {type}.</p> :
            <>
              <Button onClick={loadModel('default')} disabled={status === 'loading'}>
                {status === 'loading' ? 'Cargando modelo...' : 'Cargar modelo'}
              </Button>
              <Button onClick={loadModel('worker')} disabled={status === 'loading'}>
                {status === 'loading' ? 'Cargando modelo...' : 'Cargar modelo con Worker'}
              </Button>
            </>
        }
      </div>
      {

      }
      <div className="main-container">
        <DrawingCanvas onPredict={onPredict} />
        <Prediction prediction={prediction} confidence={confidence} />
      </div>

      <Footer />
    </div>
  );
}

export default App;