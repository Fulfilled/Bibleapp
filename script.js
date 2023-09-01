const resultTextArea = document.querySelector('.result');
const micImage = document.getElementById('micImage');
let recording = false;
let micMuted = false;
let mediaRecorder;
let chunks = [];

micImage.addEventListener('click', toggleRecording);

function toggleRecording() {
  if (!recording) {
    recording = true;
    micImage.style.opacity = 0.5;
    startRecording();
  } else {
    recording = false;
    micImage.style.opacity = 1;
    stopRecording();
  }
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/wav' });
      resultTextArea.value = 'Recording complete!';
      chunks = [];
      console.log(blob)
    };
    mediaRecorder.start();
  } catch (error) {
    console.error('Error accessing microphone:', error);
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
    // Call the sendAudioRecording function to send the recorded audio
    sendAudioRecording(blob);
  }
}

function sendAudioRecording(chunks) {
    const blob = new Blob(chunks, { type: 'audio/wav' });
    // Create a FormData instance and append the audio blob
    const formData = new FormData();
    formData.append('audio', blob);
    
    // Set up the HTTP headers and payload for the POST request
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    const payload = formData;
    
    // Make the POST request to the API endpoint
    fetch('http://127.0.0.1:5000/api/recordings', {
      method: 'POST',
      headers,
      body: payload,
    })
      .then(response => response.json())
      .then(data => {
        console.log('Recording sent successfully:', data);
        // Clear chunks array for next recording
        chunks = [];
      })
      .catch(error => {
        console.error('Error sending recording:', error);
        // Clear chunks array in case of error
        chunks = [];
      });
  }
