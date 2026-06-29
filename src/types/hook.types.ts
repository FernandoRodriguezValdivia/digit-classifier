import { ModelStatus } from "./model.types";

export interface UseModelReturn {
  loadModel: () => Promise<void>;
  onPredict: (image: ImageData | null) => Promise<void>;
  status: ModelStatus;
  error: string | null;
  prediction: number | null;
  confidence: number;
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