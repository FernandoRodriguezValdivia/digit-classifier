import { useRef, useState, useEffect, useCallback } from 'react';
import styles from './DrawingCanvas.module.css'
import Button from '../Button/Button';
import { useDrawing } from '../../hooks/useDrawing';
import { cropAndResizeDigit, extractDigitBoundingBox, preProcessCanvas } from '../../utils/imagePreprocessor';

const DrawingCanvas = ({ onPredict }) => {
  const predict = useCallback(async () => {
    const canvas = canvasRef.current;
    const imageData1 = preProcessCanvas(canvas)
    await onPredict(imageData1);
  }, [onPredict]);

  const { canvasRef, initCanvas, handleMouseDown, handleMouseMove, handleMouseUp, clearCanvas } =
    useDrawing(predict);

  useEffect(() => {
    initCanvas();
  }, []);

  useEffect(() => {
    console.log('handleMouseMove creado')
  }, [handleMouseMove])

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        className={styles.canvas}
      />
      <Button onClick={clearCanvas}>
        🧹 Limpiar
      </Button>
    </div>
  );
};

export default DrawingCanvas;