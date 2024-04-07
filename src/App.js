import React, { useRef, useEffect, useState } from 'react';
import * as tmPose from '@teachablemachine/pose';

const YourComponent = () => {
  const URL = 'https://teachablemachine.withgoogle.com/models/-vTgwJKjf/'; // Replace {{URL}} with your actual URL
  const [model, setModel] = useState(null);
  const [webcam, setWebcam] = useState(null);
  const [ctx, setCtx] = useState(null);
  const [labelContainer, setLabelContainer] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [maxPredictions, setMaxPredictions] = useState(0);
  const canvasRef = useRef(null);

  const init = async () => {
    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';

    // Load the model and metadata
    const loadedModel = await tmPose.load(modelURL, metadataURL);
    setModel(loadedModel);
    const predictions = loadedModel.getTotalClasses();
    setMaxPredictions(predictions);

    // Setup webcam
    const flip = true; // whether to flip the webcam
    const webcamInstance = new tmPose.Webcam(200, 200, flip); // width, height, flip
    await webcamInstance.setup(); // request access to the webcam
    webcamInstance.play();
    setWebcam(webcamInstance);

    // Get canvas context
    const canvas = canvasRef.current;
    canvas.width = 200;
    canvas.height = 200;
    const context = canvas.getContext('2d');
    setCtx(context);

    // Create label container elements
    const container = [];
    for (let i = 0; i < predictions; i++) {
      container.push(document.createElement('div'));
    }
    setLabelContainer(container);
  };

  useEffect(() => {
    init();

    // Cleanup function
    return () => {
      if (webcam) webcam.stop();
    };
  }, []); // Empty dependency array to ensure it runs only once on mount

  useEffect(() => {
    const loop = (timestamp) => {
      if (webcam) webcam.update(); // update the webcam frame
      predict();
      window.requestAnimationFrame(loop);
    };

    window.requestAnimationFrame(loop);
  }, [webcam]);

  const predict = async () => {
    if (labelContainer && model && webcam) { // Null check for labelContainer
      // Prediction #1: run input through posenet
      const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
      // Prediction #2: run input through teachable machine classification model
      const prediction = await model.predict(posenetOutput);
      setPredictions(prediction);

      labelContainer.forEach((label, i) => {
        label.innerHTML = `${prediction[i].className}: ${prediction[i].probability.toFixed(2)}`;
      });

      // Finally draw the poses
      drawPose(pose);
    }
  };

  const drawPose = (pose) => {
    if (ctx && webcam) {
      ctx.drawImage(webcam.canvas, 0, 0);
      // Draw the keypoints and skeleton
      if (pose) {
        const minPartConfidence = 0.5;
        tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
        tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
      }
    }
  };

  return (
    <div>
      <div>Teachable Machine Pose Model</div>
      <button type='button' onClick={init}>Start</button>
      <div><canvas ref={canvasRef}></canvas></div>
      <div id='label-container'>
        {labelContainer && labelContainer.map((label, index) => (
          <div key={index}></div>
        ))}
      </div>
      <div id='predictions'>
        {predictions.map((prediction, index) => (
          <div key={index}>{prediction.className}: {prediction.probability.toFixed(2)}</div>
        ))}
      </div>
    </div>
  );
};

export default YourComponent;
