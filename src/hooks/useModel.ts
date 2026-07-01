import { useCallback, useEffect, useRef, useState } from "react";
import { ModelService } from "../core/services/ModelService";
import { UseModelReturn, WorkerMessage } from "../types/hook.types";
import { ModelStatus } from "../types/model.types";


export const useModel = (): UseModelReturn => {
  const workerRef = useRef<Worker | null>(null);
  const service = useRef<ModelService>(new ModelService())
  const [status, setStatus] = useState<ModelStatus>(service.current.getStatus());
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [type, setType] = useState<'default' | 'worker' | null>(null);

  const initializeWorker = useCallback(() => {
    if (workerRef.current) {
      return;
    }

    const worker = new Worker(
      new URL('../workers/prediction.worker.ts', import.meta.url),
      { type: 'module' }
    )

    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const data = event.data;
      if (data.type === 'listo') {
        setStatus(data.status);
        setType('worker');
      }

      if (data.type === 'error') {
        console.error('❌ Error recibido del Worker:', data.message);
        setError(data.message);
        if (data.status) {
          setStatus(data.status);
        }
      }

      if (data.type === 'result') {
        setPrediction(data.digit);
        setConfidence(data.confidence);
      }
    };

    worker.onerror = (error: ErrorEvent) => {
      console.error('❌ Error en Worker:', error);
      setError(error.message);
    };
  }, []);

  const loadModel = (type: 'default' | 'worker') => async (): Promise<void> => {
    setStatus('loading');
    if (type === 'worker') {
      initializeWorker();
      workerRef.current?.postMessage({ type: 'loadModel' });
    } else {
      try {
        await service.current.loadModel();
      } catch (e) {
        const error = e instanceof Error ? e.message : 'Error desconocido';
        setError(error)
      } finally {
        setStatus(service.current.getStatus());
        setType('default');
      }
    }
  }

  const onPredict = useCallback(async (image: ImageData | null): Promise<void> => {
    if (image === null) {
      setPrediction(null);
      setConfidence(0);
      return;
    }

    if (!image) return;

    if (type === 'worker') {
      workerRef.current?.postMessage({ type: 'predict', imageData: image });
    } else {
      try {
        const result = service.current.predict(image);
        setPrediction(result.digit);
        setConfidence(result.confidence);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        throw err;
      }
    }
  }, [type]);

  useEffect(() => {
    return () => {
      if (type === 'worker') {
        workerRef.current?.postMessage({ type: 'dispose' });
        workerRef.current?.terminate();
      }
      service.current.dispose();
    }
  }, [])

  return { loadModel, onPredict, status, error, prediction, confidence, type }
}