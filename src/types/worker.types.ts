interface LoadModelMessage {
  type: 'loadModel';
}

interface PredictMessage {
  type: 'predict';
  imageData: ImageData;
}

interface DisposeMessage {
  type: 'dispose';
}

export type WorkerMessage = LoadModelMessage | PredictMessage | DisposeMessage;