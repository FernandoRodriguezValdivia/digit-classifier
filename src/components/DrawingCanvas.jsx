import { useRef, useState, useEffect } from 'react';

const DrawingCanvas = ({ onPredict }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPredictTimeRef = useRef(0);
  const PREDICT_INTERVAL = 500;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = 280;
    canvas.height = 280;
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = 'white';
    context.lineWidth = 15;
    context.lineCap = 'round';
    context.lineJoin = 'round';
  }, []);

  const getPositions = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top)
    };
  }

  const onMouseDown = (e) => {
    setIsDrawing(true);
    const { x, y } = getPositions(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  const onMouseMove = async(e) => {
    if (!isDrawing) return;
    const { x, y } = getPositions(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();

    const now = Date.now();
    if (lastPredictTimeRef.current === 0 || now - lastPredictTimeRef.current > PREDICT_INTERVAL) {
      await predict();
      lastPredictTimeRef.current = now;
    }
  }

  const onMouseUp = async() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();

    await predict();
  }

  const ontouchstart = (evt) => {
    const loc = evt.touches[0];
    onMouseDown(loc);
  }

  const ontouchmove = (evt) => {
    const loc = evt.touches[0];
    onMouseMove(loc);
  }

  const ontouchend = () => {
    onMouseUp();
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    onPredict(null);
  };

  const drawCropSquare = (srcX, srcY, size) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.save();

    ctx.strokeStyle = "lime";
    ctx.lineWidth = 2;

    ctx.strokeRect(srcX, srcY, size, size);

    ctx.restore();
  };

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

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={ontouchstart}
        onTouchMove={ontouchmove}
        onTouchEnd={ontouchend}
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
      <button onClick={clearCanvas} className="clear-btn">
        🧹 Limpiar
      </button>
      {/* <button onClick={predict} className="predict-btn">
        🔍 Predecir
      </button> */}
    </div>
  );
};

export default DrawingCanvas;