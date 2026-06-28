import * as tf from '@tensorflow/tfjs';

export const preprocessImage = (canvas) => {
  return tf.tidy(() => {
    const tensor = tf.browser.fromPixels(canvas, 1);
    const normalized = tensor.toFloat().div(255.0);
    const batchTensor = normalized.expandDims(0);
    return batchTensor;
  })
}