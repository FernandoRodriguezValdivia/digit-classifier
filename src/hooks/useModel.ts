import { useCallback, useEffect, useRef, useState } from "react";
import { ModelService } from "../core/services/ModelService";
import { UseModelReturn } from "../types/hook.types";
import { ModelStatus } from "../types/model.types";

export const useModel = (): UseModelReturn => {
  const service = useRef<ModelService>(new ModelService())
  const [status, setStatus] = useState<ModelStatus>(service.current.getStatus());
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number>(0);

  const loadModel = async (): Promise<void> => {
    try {
      setStatus('loading');
      await service.current.loadModel();
    } catch (e) {
      const error = e instanceof Error ? e.message : 'Error desconocido';
      setError(error)
    } finally {
      setStatus(service.current.getStatus());
    }
  }

  const onPredict = useCallback(async (image: ImageData | null): Promise<void> => {
    if (image === null) {
      setPrediction(null);
      setConfidence(0);
      return;
    }

    if (!image) return;

    try {
      const result = await service.current.predict(image);
      setPrediction(result.digit);
      setConfidence(result.confidence);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    }
  }, []);

  useEffect(() => {
    return () => {
      service.current.dispose();
    }
  }, [])

  return { loadModel, onPredict, status, error, prediction, confidence }
}