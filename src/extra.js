import React, { useRef, useState, useEffect } from "react";
import * as tmImage from "@teachablemachine/image";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
function App() {
  const webcamRef = useRef(null);
  const labelContainerRef = useRef(null);

  const [model, setModel] = useState(null);
  const [maxPredictions, setMaxPredictions] = useState(0);

  const URL = '{{URL}}'; // Update this with your model URL

  useEffect(() => {
    const init = async () => {
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

      const loadedModel = await tmImage.load(modelURL, metadataURL);
      setModel(loadedModel);
      setMaxPredictions(loadedModel.getTotalClasses());
    };

    init();

    // Cleanup function
    return () => {
      if (model) {
        model.dispose();
      }
    };
  }, []);

  const loop = async () => {
    if (!model) return;

    const webcam = webcamRef.current.video;
    if (!webcam) return;

    webcam.update(); // update the webcam frame
    const prediction = await model.predict(webcam);
    for (let i = 0; i < maxPredictions; i++) {
      const classPrediction =
        prediction[i].className + ": " + prediction[i].probability.toFixed(2);
      labelContainerRef.current.childNodes[i].innerHTML = classPrediction;
    }

    requestAnimationFrame(loop);
  };

  useEffect(() => {
    loop();
  }, [model, maxPredictions]);

  return (
    <div className="App">
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
      <div id="label-container" ref={labelContainerRef}>
        {Array.from({ length: maxPredictions }).map((_, index) => (
          <div key={index}></div>
        ))}
      </div>
    </div>
  );
}

export default App;
