import React, { useRef, useEffect, useState } from 'react';
import * as tmPose from '@teachablemachine/pose';
import * as tmImage from '@teachablemachine/image';
import Navbar from './navbar'; 
import About from './about'; 
import Contacts from './contacts'; 

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

  // Flashlight State
  const [flashlightOn, setFlashlightOn] = useState(false);

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
    const ws = new WebSocket('ws://192.168.1.8:8999');
  
    ws.addEventListener('open', (event) => {
      ws.send(JSON.stringify({
        'client': '8999',
        'operation': 'connecting',
        'data': {}
      }));
    });
  
    ws.onmessage = async message => {
      let md = JSON.parse(message.data);
  
      for (const device in md.devices) {
        if (!document.querySelector('#' + device)) {
          document.querySelector('#main-wrapper')
            .appendChild(createElement('div', { id: device, class: md.devices[device].class + ' item' }))
            .appendChild(createElement('h2', { id: device + '-header', class: 'sensors-header' }, md.devices[device].display));
          document.querySelector('#' + device)
            .appendChild(createElement('div', { id: 'wrap-' + device + '-image', class: 'image-wrapper' }))
            .appendChild(createElement('img', { id: 'img-' + device }));
          document.querySelector('#' + device)
            .appendChild(createElement('div', { id: 'wrap-' + device + '-commands' }));
        }
  
        if (md.devices[device].image) {
          document.querySelector('#img-' + device).src = "data:image/jpeg;base64," + md.devices[device].image;
  
          // For Pose Model
          if (poseModel && poseCanvasRef.current) {
            const image = document.querySelector('#img-' + device);
            const { pose, posenetOutput } = await poseModel.estimatePose(image);
            const posePrediction = await poseModel.predict(posenetOutput);
            setPosePredictions(posePrediction);
            drawPose(pose);
          }
  
          // For Image Model
          if (imageModel) {
            const image = document.querySelector('#img-' + device);
            const imagePrediction = await imageModel.predict(image);
            setImagePredictions(imagePrediction);
  
            // Speak if class detected
            speakIfDetected(imagePrediction, posePredictions);
          }
        }
  
        if (md.devices[device].peripherals) {
          for (const [id, state] of Object.entries(md.devices[device].peripherals)) {
            if (!document.querySelector('#' + device + '-' + id)) {
              document.querySelector('#wrap-' + device + '-commands')
                .appendChild(createElement('div', {
                  id: device + '-' + id,
                  class: 'command-button',
                  onClick: () => toggleFlash()
                })).appendChild(createElement('div', {
                  id: device + '-' + id + '-state',
                  class: 'on-off-icon',
                  'data-state': state
                }));
            } else {
              // Has any state changed?
              let element = document.querySelector('#' + device + '-' + id + '-state');
  
              if (element && state != element.dataset.state) {
                element.dataset.state = state;
              }
            }
          }
        }
      }
    };
  
    return () => {
      ws.close();
    };
  }, [poseModel, imageModel]); // Include poseModel and imageModel in dependency array to trigger effect on changes
  
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
  
  const toggleFlash = () => {
    // Send a message to control the flash
    // Example: send a WebSocket message to ESP32-CAM to turn on/off the flash
    // You need to implement this functionality based on your ESP32-CAM code
    setFlashlightOn(prevState => !prevState); // Toggle flashlight state in the app
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

  const createElement = (e, a, i) => {
    if(typeof(e) === "undefined"){ return false; } 
    if(typeof(i) === "undefined"){ i = ""; }
    let el = document.createElement(e);
    if(typeof(a) === 'object') { for(let k in a) { el.setAttribute(k,a[k]); }}
    if(!Array.isArray(i)) { i = [i]; }
    for(let k = 0; k < i.length; k++) { if(i[k].tagName) { el.appendChild(i[k]); } else { el.appendChild(document.createTextNode(i[k])); }}
    return el;
  };

  const ProgressBar = ({ progress }) => (
    <div className="bg-gray-200 h-2 rounded-lg overflow-hidden w-full">
      <div className="bg-blue-500 h-full" style={{ width: `${progress * 100}%` }}></div>
    </div>
  );
  
  return (
    <div>
      <div><canvas ref={poseCanvasRef} width={50} height={50}></canvas></div>
      <div className="flex flex-col items-center justify-center h-screen">
        {/* Placeholder for ESP32-CAM image */}
        <div id="main-wrapper">
          {/* ESP32-CAM image */}
        </div>
        
        <div className="grid grid-cols-2 gap-4"> {/* Use a grid with two columns */}
          <div className="relative">
            <div className="mb-2">Human Action Recognition</div>
            
            <div id='pose-predictions' className="mt-1">
              {posePredictions.map((prediction, index) => (
                <div key={index} className="flex items-center mb-2"> {/* Align items center */}
                  <div className="w-24">{prediction.className}:</div> {/* Fixed width for label */}
                  <ProgressBar progress={prediction.probability} />
                </div>
              ))}
            </div>
          </div>
    
          <div className="relative">
            <div className="mb-2">Image Classification</div> {/* Add a heading for image predictions */}
            <div id="image-label-container">
              {imagePredictions.map((prediction, index) => (
                <div key={index} className="flex items-center mb-2"> {/* Align items center */}
                  <div className="w-24">{prediction.className}:</div> {/* Fixed width for label */}
                  <ProgressBar progress={prediction.probability} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <button onClick={toggleFlash} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Toggle Flash</button>
      </div>
    </div>
  );
};

export default CombinedComponent;