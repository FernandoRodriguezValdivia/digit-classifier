import * as tf from '@tensorflow/tfjs';

let model = null;

const MODEL_URL = '/tfjs_model/model.json';

export async function loadModel() {
  if (model) return model;

  console.log('🔄 Cargando modelo pre-entrenado...');
  try {
    model = await tf.loadLayersModel(MODEL_URL);
    const dummyTensor = tf.zeros([1, 28, 28, 1]);
    const warmupPrediction = model.predict(dummyTensor);
    await warmupPrediction.data();
    warmupPrediction.dispose();
    dummyTensor.dispose();
    console.log("Modelo listo con presicion 98.54%");
    // console.log(model.outputShape); // Debug: verificar que la salida es [null, 10]
    return model;
  } catch (error) {
    console.error('❌ Error cargando el modelo:', error);
    throw error;
  }
}

export async function predictDigit(model, imageData) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = async () => {
      try {
        const { predictions, minVal, maxVal } = tf.tidy(() => {
          let tensor = tf.browser.fromPixels(img, 1); // Convertir imagen a tenso

          tensor = tensor.toFloat().div(255.0); // Normalizar

          // Añadir dimensión de lote para que sea [1, 28, 28, 1]
          const batchTensor = tensor.expandDims(0);

          // Extraemos los valores min y max
          const minVal = batchTensor.min().dataSync()[0];
          const maxVal = batchTensor.max().dataSync()[0];

          // Ejecutar la predicción dentro del entorno controlado
          const predictions = model.predict(batchTensor);

          // Retornamos el tensor de predicciones y las métricas de depuración
          // tf.tidy mantendrá vivo 'predictions' pero destruirá 'tensor' y 'batchTensor'
          return { predictions, minVal, maxVal };
        });

        // Descargar los datos de la predicción de la GPU a la CPU de forma asíncrona
        const probabilitiesArray = await predictions.data();

        // Liberamos el último tensor que quedó vivo (las predicciones)
        predictions.dispose();

        // Encontrar el dígito con mayor probabilidad
        const predictedDigit = probabilitiesArray.reduce(
          (maxIdx, currentVal, currentIdx, arr) => 
            currentVal > arr[maxIdx] ? currentIdx : maxIdx, 0
        );
        const maxProb = probabilitiesArray[predictedDigit];

        resolve({ digit: predictedDigit, confidence: maxProb });
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = reject;
    img.src = imageData;
  });
}

// versión anterior sin tf.tidy ni optimizaciones de memoria
// export async function predictDigit(model, imageData) {
//   return new Promise((resolve, reject) => {
//     const img = new Image();

//     img.onload = async () => {
//       try {
//         let tensor = tf.browser.fromPixels(img, 1); // grayscale directo

//         tensor = tf.image.resizeBilinear(tensor, [28, 28]);

//         tensor = tensor.toFloat().div(255);

//         // NO invertir (ya está correcto)
//         tensor = tensor.expandDims(0);
//         console.log(
//           tensor.min().dataSync()[0],
//           tensor.max().dataSync()[0]
//         );
//         const predictions = model.predict(tensor);
//         const probabilities = await predictions.data();

//         console.log(Array.from(probabilities));

//         let predictedDigit = 0;
//         let maxProb = 0;

//         for (let i = 0; i < probabilities.length; i++) {
//           if (probabilities[i] > maxProb) {
//             maxProb = probabilities[i];
//             predictedDigit = i;
//           }
//         }

//         tensor.dispose();
//         predictions.dispose();

//         resolve({ digit: predictedDigit, confidence: maxProb });
//       } catch (err) {
//         reject(err);
//       }
//     };

//     img.onerror = reject;
//     img.src = imageData;
//   });
// }