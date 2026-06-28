import { useRef, useState, useEffect } from 'react';
import styles from './DrawingCanvas.module.css'
import Button from '../Button/Button';
import { useDrawing } from '../../hooks/useDrawing';
import { cropAndResizeDigit, extractDigitBoundingBox, preProcessCanvas } from '../../utils/imagePreprocessor';

const DrawingCanvas = ({ onPredict }) => {
  const predict = async () => {
    const canvas = canvasRef.current;
    const imageData1 = preProcessCanvas(canvas)
    await onPredict(imageData1);
  };

  const { canvasRef, initCanvas, handleMouseDown, handleMouseMove, handleMouseUp, clearCanvas } =
    useDrawing(predict);

  useEffect(() => {
    initCanvas();
  }, []);

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
        style={{
          border: '2px solid #667eea',
          borderRadius: '10px',
          cursor: 'crosshair',
          backgroundColor: 'black',
          width: '280px',
          height: '280px',
          touchAction: 'none'
        }}
      />
      <Button onClick={clearCanvas}>
        🧹 Limpiar
      </Button>
    </div>
  );
};

export default DrawingCanvas;