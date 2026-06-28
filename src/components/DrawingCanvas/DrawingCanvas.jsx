import { useRef, useState, useEffect } from 'react';
import styles from './DrawingCanvas.module.css'
import Button from '../Button/Button';
import { useDrawing } from '../../hooks/useDrawing';

const DrawingCanvas = ({ onPredict }) => {
  const predict = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let minX = canvas.width;
    let minY = canvas.height;
    let maxX = 0;
    let maxY = 0;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;

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

    if (maxX <= minX || maxY <= minY) {
      onPredict(null);
      return;
    };

    const width = maxX - minX;
    const height = maxY - minY;

    const size = Math.max(width, height) + 20;

    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = 28;
    tmpCanvas.height = 28;

    const tmpCtx = tmpCanvas.getContext("2d");

    tmpCtx.fillStyle = "black";
    tmpCtx.fillRect(0, 0, 28, 28);

    const paddingX = (size - width) / 2;
    const paddingY = (size - height) / 2;

    const srcX = minX - paddingX;
    const srcY = minY - paddingY;

    // drawCropSquare(srcX, srcY, size);

    tmpCtx.drawImage(
      canvas,
      srcX,
      srcY,
      size,
      size,
      0,
      0,
      28,
      28
    );

    const imageData1 = tmpCtx.getImageData(0, 0, 28, 28);
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