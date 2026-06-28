import * as tf from '@tensorflow/tfjs';
import { preprocessImage } from '../../utils/imagePreprocessor';

export class ModelService {
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
      const warmupPrediction = this.model.predict(dummyTensor);
      await warmupPrediction.data();
      warmupPrediction.dispose();
      dummyTensor.dispose();
      this.status = 'ready';
      console.log('ready')
    } catch (e) {
      this.status = 'error';
      this.error = e.message;
      throw new Error(`Failed to load model: ${e.message}`);
    }
  }

  predict(canvas) {
    if (!this.model || this.status !== 'ready') {
      throw new Error('Model is not ready');
    }

    return tf.tidy(() => {
      const tensor = preprocessImage(canvas);
      const predictions = this.model.predict(tensor);
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

  getStatus() {
    return this.status;
  }

  dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }

    this.status = 'idle';
  }
}