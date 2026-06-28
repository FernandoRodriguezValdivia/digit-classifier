import * as tf from '@tensorflow/tfjs';
import { CANVAS_HEIGHT, CANVAS_WIDTH, MODEL_INPUT_HEIGHT, MODEL_INPUT_WIDTH } from '../constants';

export const extractDigitBoundingBox = (imageData) => {
  const data = imageData.data;

  let minX = CANVAS_WIDTH;
  let minY = CANVAS_HEIGHT;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < CANVAS_HEIGHT; y++) {
    for (let x = 0; x < CANVAS_WIDTH; x++) {
      const i = (y * CANVAS_WIDTH + x) * 4;

      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const brightness = (r + g + b) / 3;

      if (r > 250 && g > 250 && b > 250) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  return { minX, minY, maxX, maxY };
}

export const cropAndResizeDigit = (canvas, { minX, minY, maxX, maxY }) => {
  const width = maxX - minX;
  const height = maxY - minY;

  const size = Math.max(width, height) + 20;

  const tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = 28;
  tmpCanvas.height = 28;

  const tmpCtx = tmpCanvas.getContext("2d");

  tmpCtx.fillStyle = "black";
  tmpCtx.fillRect(0, 0, MODEL_INPUT_WIDTH, MODEL_INPUT_HEIGHT);

  const paddingX = (size - width) / 2;
  const paddingY = (size - height) / 2;

  const srcX = minX - paddingX;
  const srcY = minY - paddingY;

  tmpCtx.drawImage(
    canvas,
    srcX,
    srcY,
    size,
    size,
    0,
    0,
    MODEL_INPUT_WIDTH,
    MODEL_INPUT_HEIGHT
  );

  return tmpCtx.getImageData(0, 0, MODEL_INPUT_WIDTH, MODEL_INPUT_HEIGHT);;
}

export const preProcessCanvas = (canvas) => {
  const ctx = canvas.getContext("2d");

  const imageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  const boundingBox = extractDigitBoundingBox(imageData)

  if (boundingBox.maxX <= boundingBox.minX || boundingBox.maxY <= boundingBox.minY) {
    return null;
  };

  return cropAndResizeDigit(canvas, boundingBox)
}

export const preprocessImage = (canvas) => {
  return tf.tidy(() => {
    const tensor = tf.browser.fromPixels(canvas, 1);
    const normalized = tensor.toFloat().div(255.0);
    const batchTensor = normalized.expandDims(0);
    return batchTensor;
  })
}