import { ModelService } from "../core/services/ModelService";
import { WorkerMessage } from "../types/worker.types";


const service = new ModelService();

self.addEventListener('message', async (event: MessageEvent<WorkerMessage>) => {
  const { type } = event.data;

  if (type === 'loadModel') {
    try {
      await service.loadModel();
      self.postMessage({
        type: 'listo',
        status: service.getStatus(),
      });
    } catch (error) {
      self.postMessage({
        type: 'error',
        status: service.getStatus(),
        message: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
    return;
  }

  if (type === 'predict') {
    try {
      const { imageData } = event.data;
      const result = service.predict(imageData);
      self.postMessage({
        type: 'result',
        digit: result.digit,
        confidence: result.confidence,
      });
    } catch (error) {
      self.postMessage({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error desconocido',
      });
    }

    return;
  }

  if (type === 'dispose') {
    service.dispose();
    self.postMessage({ type: 'disposed' });
  }
});