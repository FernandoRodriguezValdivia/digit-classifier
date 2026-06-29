import { useCallback, useRef, useState } from "react";
import { CANVAS_HEIGHT, CANVAS_WIDTH, LINE_WIDTH, PREDICT_INTERVAL } from "../constants";
import { Client, Position } from "../types/drawing.types";
import { MouseOrTouchEvent, UseDrawingReturn } from "../types/hook.types";

export const useDrawing = (onPredict: () => Promise<void>): UseDrawingReturn => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const lastPredictTimeRef = useRef<number>(0);

  const initCanvas = (): void => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const context = canvas.getContext('2d');

    if (!context) return;

    context.fillStyle = 'black';
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.strokeStyle = 'white';
    context.lineWidth = LINE_WIDTH;
    context.lineCap = 'round';
    context.lineJoin = 'round';
  }

  const getPositions = useCallback((e: Client): Position => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 }
    return {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top)
    };
  }, [])

  const startDrawing = (e: Client): void => {
    setIsDrawing(true);
    const { x, y } = getPositions(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  const draw = useCallback(async (e: Client): Promise<void> => {
    if (!isDrawing) return;
    const { x, y } = getPositions(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(x, y);
    ctx.stroke();

    const now = Date.now();
    if (lastPredictTimeRef.current === 0 || now - lastPredictTimeRef.current > PREDICT_INTERVAL) {
      await onPredict();
      lastPredictTimeRef.current = now;
    }
  }, [isDrawing, getPositions, onPredict])

  const stopDrawing = useCallback(async (): Promise<void> => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    await onPredict();
  }, [isDrawing, onPredict])

  const clearCanvas = async (): Promise<void> => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    await onPredict();
  };

  const getEventCoordinates = useCallback((e: MouseOrTouchEvent): Client => {
    if ('touches' in e) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }

    return { clientX: e.clientX, clientY: e.clientY };
  }, [])

  const handleMouseDown = (e: MouseOrTouchEvent) => {
    const coords = getEventCoordinates(e)
    startDrawing(coords)
  }

  const handleMouseMove = useCallback((e: MouseOrTouchEvent) => {
    const coords = getEventCoordinates(e);
    draw(coords);
  }, [draw])

  const handleMouseUp = () => {
    stopDrawing();
  }

  return {
    canvasRef,
    initCanvas,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    clearCanvas,
    isDrawing,
  };
}