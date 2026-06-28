import { useCallback, useRef, useState } from "react";
import { CANVAS_HEIGHT, CANVAS_WIDTH, LINE_WIDTH, PREDICT_INTERVAL } from "../constants";

export const useDrawing = (onPredict) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPredictTimeRef = useRef(0);

  const initCanvas = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const context = canvas.getContext('2d');

    context.fillStyle = 'black';
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.strokeStyle = 'white';
    context.lineWidth = LINE_WIDTH;
    context.lineCap = 'round';
    context.lineJoin = 'round';
  }

  const getPositions = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top)
    };
  }, [])

  const startDrawing = (e) => {
    setIsDrawing(true);
    const { x, y } = getPositions(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  const draw = useCallback(async (e) => {
    if (!isDrawing) return;
    const { x, y } = getPositions(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();

    const now = Date.now();
    if (lastPredictTimeRef.current === 0 || now - lastPredictTimeRef.current > PREDICT_INTERVAL) {
      await onPredict();
      lastPredictTimeRef.current = now;
    }
  }, [isDrawing, getPositions, onPredict])

  const stopDrawing = useCallback(async () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    await onPredict();
  }, [isDrawing, onPredict])

  const clearCanvas = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    await onPredict(null);
  };

  const getEventCoordinates = useCallback((e) => {
    if (e.touches) {
      return e.touches[0]
    }

    return e;
  }, [])

  const handleMouseDown = (e) => {
    const coords = getEventCoordinates(e)
    startDrawing(coords)
  }

  const handleMouseMove = useCallback((e) => {
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