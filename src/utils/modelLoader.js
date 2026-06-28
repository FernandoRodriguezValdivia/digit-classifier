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
    // console.log(model.outputShape);
    return model;
  } catch (error) {
    console.error('❌ Error cargando el modelo:', error);
    throw error;
  }
}

export async function predictDigit(model, imageData) {
  return new Promise((resolve, reject) => {
    try {
      // Usar tf.tidy para gestión automática de memoria
      const result = tf.tidy(() => {
        const tensor = tf.browser.fromPixels(imageData, 1);
        
        const normalized = tensor.toFloat().div(255.0);
        
        const batchTensor = normalized.expandDims(0);
        
        const predictions = model.predict(batchTensor);
        
        const probs = predictions.dataSync();
        
        let maxIdx = 0;
        let maxProb = probs[0];
        for (let i = 1; i < probs.length; i++) {
          if (probs[i] > maxProb) {
            maxProb = probs[i];
            maxIdx = i;
          }
        }
        
        return { digit: maxIdx, confidence: maxProb };
      });
      
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}


// export async function predictDigit(model, imageData) {
//   return new Promise((resolve, reject) => {
//     const img = new Image();

//     img.onload = async () => {
//       try {
//         const { predictions, minVal, maxVal } = tf.tidy(() => {
//           let tensor = tf.browser.fromPixels(img, 1);

//           tensor = tensor.toFloat().div(255.0);

//           const batchTensor = tensor.expandDims(0);

//           const minVal = batchTensor.min().dataSync()[0];
//           const maxVal = batchTensor.max().dataSync()[0];

//           const predictions = model.predict(batchTensor);

//           return { predictions, minVal, maxVal };
//         });

//         const probabilitiesArray = await predictions.data();

//         predictions.dispose();

//         const predictedDigit = probabilitiesArray.reduce(
//           (maxIdx, currentVal, currentIdx, arr) => 
//             currentVal > arr[maxIdx] ? currentIdx : maxIdx, 0
//         );
//         const maxProb = probabilitiesArray[predictedDigit];

//         resolve({ digit: predictedDigit, confidence: maxProb });
//       } catch (err) {
//         reject(err);
//       }
//     };

//     img.onerror = reject;
//     img.src = imageData;
//   });
// }

// versión anterior sin tf.tidy ni optimizaciones de memoria
// export async function predictDigit(model, imageData) {
//   return new Promise((resolve, reject) => {
//     const img = new Image();

//     img.onload = async () => {
//       try {
//         let tensor = tf.browser.fromPixels(img, 1);

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