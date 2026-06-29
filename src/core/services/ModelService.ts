import * as tf from '@tensorflow/tfjs';
import { preprocessImage } from '../../utils/imagePreprocessor';
import { IModelService, ModelStatus, PredictionResult } from '../../types/model.types';

export class ModelService implements IModelService {
  model: tf.LayersModel | null = null;
  status: ModelStatus = 'idle';
  error: string | null = null;
  private readonly MODEL_URL: string = '/tfjs_model/model.json';

  constructor() {
    this.model = null;
    this.status = 'idle';
    this.error = null;
    this.MODEL_URL = '/tfjs_model/model.json';
  }

  async loadModel() {
    if (this.model) return;

    try {
      this.status = 'loading';
      this.model = await tf.loadLayersModel(this.MODEL_URL);
      const dummyTensor = tf.zeros([1, 28, 28, 1]);
      const warmupPrediction = this.model.predict(dummyTensor) as tf.Tensor;
      await warmupPrediction.data();
      warmupPrediction.dispose();
      dummyTensor.dispose();
      this.status = 'ready';
    } catch (e) {
      this.status = 'error';
      this.error = e instanceof Error ? e.message : 'Error desconocido';
      throw new Error(`Failed to load model: ${this.error}`);
    }
  }

  predict(canvas: ImageData): PredictionResult {
    const model = this.model;
    if (!model || this.status !== 'ready') {
      throw new Error('Model is not ready');
    }

    return tf.tidy(() => {
      const tensor = preprocessImage(canvas);
      const predictions = model.predict(tensor) as tf.Tensor;
      const probs = predictions.dataSync();

      let maxIdx = 0;
      let maxProb = probs[0];
      for (let i = 1; i < probs.length; i++) {
        if (probs[i] > maxProb) {
          maxProb = probs[i];
          maxIdx = i;
        }
      }

      return { digit: maxIdx, confidence: maxProb };
    })
  }

  getStatus(): ModelStatus {
    return this.status;
  }

  dispose(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }

    this.status = 'idle';
  }
}