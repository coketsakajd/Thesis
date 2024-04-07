import React, { useRef, useState, useEffect } from "react";
import * as tmImage from "@teachablemachine/image";
import Webcam from "react-webcam";


function App() {
  const webcamRef = useRef(null);
  const labelContainerRef = useRef([]);

  const [model, setModel] = useState(null);
  const [maxPredictions, setMaxPredictions] = useState(0);
  const [predictions, setPredictions] = useState([]);

  const URL = 'https://teachablemachine.withgoogle.com/models/rZz85HzWk/'; // Update this with your model URL

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
    if (!model || !webcamRef.current) return;

    const webcam = webcamRef.current.video;
    const prediction = await model.predict(webcam);
    setPredictions(prediction);

    requestAnimationFrame(loop);
  };

  useEffect(() => {
    loop();
  }, [model]);

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
      <div id="label-container">
        {predictions.map((prediction, index) => (
          <div key={index} ref={ref => labelContainerRef.current[index] = ref}>
            {prediction.className}: {prediction.probability.toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
