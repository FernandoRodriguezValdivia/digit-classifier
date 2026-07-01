import { ModelStatus } from "./model.types";

export interface UseModelReturn {
  loadModel: (type: 'default' | 'worker') => () => Promise<void>;
  onPredict: (image: ImageData | null) => Promise<void>;
  status: ModelStatus;
  error: string | null;
  prediction: number | null;
  confidence: number;
  type: 'default' | 'worker' | null;
}

export type MouseOrTouchEvent = React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>;

export interface UseDrawingReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  initCanvas: () => void;
  handleMouseDown: (e: MouseOrTouchEvent) => void;
  handleMouseMove: (e: MouseOrTouchEvent) => void;
  handleMouseUp: () => void;
  clearCanvas: () => Promise<void>;
  isDrawing: boolean;
}

interface WorkerReadyMessage {
  type: 'listo';
  status: ModelStatus;
}

interface WorkerResultMessage {
  type: 'result';
  digit: number;
  confidence: number;
}

interface WorkerErrorMessage {
  type: 'error';
  status: ModelStatus;
  message: string;
}

export type WorkerMessage = WorkerReadyMessage | WorkerResultMessage | WorkerErrorMessage;