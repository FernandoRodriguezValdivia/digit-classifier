import { LayersModel } from '@tensorflow/tfjs';
import type { Tensor3D } from '@tensorflow/tfjs-core';

export interface PredictionResult {
  digit: number;
  confidence: number;
}

export type ModelStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface IModelService {
  model: LayersModel | null;
  status: ModelStatus;
  error: string | null;
  loadModel(): Promise<void>;
  predict(image: ImageData): PredictionResult;
  getStatus(): ModelStatus;
  dispose(): void;
}

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface ImagePreprocessor {
  preprocessImage(canvas: HTMLCanvasElement): Tensor3D;
  extractDigitBoundingBox(imageData: ImageData): BoundingBox | null;
  cropAndResizeDigit(canvas: HTMLCanvasElement, bbox: BoundingBox): ImageData | null;
}