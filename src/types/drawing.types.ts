export interface Position {
  x: number;
  y: number;
}

export interface Client {
  clientX: number;
  clientY: number;
}

export interface DrawingCanvasProps {
  onPredict: (canvas: ImageData | null) => Promise<void>;
}