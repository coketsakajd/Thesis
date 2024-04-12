import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as tmPose from '@teachablemachine/pose';
import * as tmImage from '@teachablemachine/image';

const CombinedComponent = () => {
  // Teachable Machine Pose Model
  const poseModelURL = 'https://teachablemachine.withgoogle.com/models/-vTgwJKjf/';
  // Teachable Machine Face Image Model
  const imageModelURL = 'https://teachablemachine.withgoogle.com/models/rZz85HzWk/';

  // Pose Model States
  const [poseModel, setPoseModel] = useState(null);
  const [posePredictions, setPosePredictions] = useState([]);
  const [poseMaxPredictions, setPoseMaxPredictions] = useState(0);
  const poseCanvasRef = useRef(null);

  // Image Model States
  const [imageModel, setImageModel] = useState(null);
  const [imagePredictions, setImagePredictions] = useState([]);
  const [imageMaxPredictions, setImageMaxPredictions] = useState(0);

  const webcamRef = useRef(null);
  const lastSpokenOutput = useRef(null);

  useEffect(() => {
    // Initialize Pose Model
    const initPoseModel = async () => {
      const modelURL = poseModelURL + 'model.json';
      const metadataURL = poseModelURL + 'metadata.json';

      const loadedModel = await tmPose.load(modelURL, metadataURL);
      setPoseModel(loadedModel);

      const predictions = loadedModel.getTotalClasses();
      setPoseMaxPredictions(predictions);
    };

    // Initialize Image Model
    const initImageModel = async () => {
      const modelURL = imageModelURL + 'model.json';
      const metadataURL = imageModelURL + 'metadata.json';

      const loadedModel = await tmImage.load(modelURL, metadataURL);
      setImageModel(loadedModel);
      setImageMaxPredictions(loadedModel.getTotalClasses());
    };

    initPoseModel();
    initImageModel();

    // Cleanup functions
    return () => {
      if (poseModel) poseModel.dispose();
      if (imageModel) imageModel.dispose();
    };
  }, []);

  useEffect(() => {
    const loop = async () => {
      if (!poseModel || !imageModel || !webcamRef.current) return;

      const webcam = webcamRef.current.video;
      
      // For Pose Model
      const { pose, posenetOutput } = await poseModel.estimatePose(webcam);
      const posePrediction = await poseModel.predict(posenetOutput);

      // For Image Model
      const imagePrediction = await imageModel.predict(webcam);

      setPosePredictions(posePrediction);
      setImagePredictions(imagePrediction);

      // Speak if class detected
      speakIfDetected(imagePrediction, posePrediction);

      requestAnimationFrame(loop);
    };

    loop();
  }, [poseModel, imageModel]);

  const speakIfDetected = (imagePredictions, posePredictions) => {
    const threshold = 0.9; // Adjust as needed
    let imageClass = null;
    let poseAction = null;

    // Check for image classification
    imagePredictions.forEach(prediction => {
      if (prediction.probability > threshold) {
        imageClass = prediction.className;
      }
    });

    // Check for pose estimation
    posePredictions.forEach(prediction => {
      if (prediction.probability > threshold) {
        poseAction = prediction.className;
      }
    });

    // Update spoken output
    let spokenOutput = lastSpokenOutput.current;
    if (imageClass && poseAction) {
      spokenOutput = `${imageClass} is ${poseAction}`;
    } else if (imageClass) {
      spokenOutput = `${imageClass} is ${spokenOutput ? spokenOutput.split(' ')[2] : ''}`;
    } else if (poseAction) {
      spokenOutput = `${spokenOutput ? spokenOutput.split(' ')[0] : ''} is ${poseAction}`;
    }

    // Speak if output changed
    if (spokenOutput && spokenOutput !== lastSpokenOutput.current) {
      speak(spokenOutput);
      lastSpokenOutput.current = spokenOutput;
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const drawPose = (pose) => {
    const ctx = poseCanvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, 200, 200);
    if (pose) {
      const minPartConfidence = 0.5;
      tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
      tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
    }
  };

  return (
    <div>
      <div>Teachable Machine Pose Model</div>
      <div><canvas ref={poseCanvasRef} width={200} height={200}></canvas></div>
      <div id='pose-predictions'>
        {posePredictions.map((prediction, index) => (
          <div key={index}>{prediction.className}: {prediction.probability.toFixed(2)}</div>
        ))}
      </div>

      <div id="webcam-container">
        <Webcam
          ref={webcamRef}
          muted={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480
          }}
        />
      </div>

      <div id="image-label-container">
        {imagePredictions.map((prediction, index) => (
          <div key={index}>
            {prediction.className}: {prediction.probability.toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CombinedComponent;