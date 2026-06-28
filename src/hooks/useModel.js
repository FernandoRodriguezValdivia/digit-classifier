import { useCallback, useEffect, useRef, useState } from "react";
import { ModelService } from "../core/services/ModelService";

export const useModel = () => {
  const service = useRef(new ModelService())
  const [status, setStatus] = useState(service.current.getStatus());
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(0);

  const loadModel = async () => {
    try {
      setStatus('loading');
      console.log('loading')
      console.log(service.current)
      await service.current.loadModel();
    } catch (e) {
      console.log(e)
      setError(e.message)
    } finally {
      console.log('finally')
      setStatus(service.current.getStatus());
    }
  }

  const onPredict = useCallback(async (canvas) => {
    if (canvas === null) {
      setPrediction(null);
      setConfidence(0);
      return;
    }

    if (!canvas) return;

    try {
      const result = await service.current.predict(canvas);
      setPrediction(result.digit);
      setConfidence(result.confidence);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, []);

  useEffect(() => {
    return () => {
      service.current.dispose();
    }
  }, [])

  return { loadModel, onPredict, status, error, prediction, confidence }
}