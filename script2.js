// Get references to the necessary DOM elements
const micButton = document.getElementById("mic");
const transcriptBox = document.getElementById("transcript");
const loader = document.getElementById("loader");

// Define variables for storing state
let recording = null;
let recognizing = false;

// Function to start recording
function startRecording() {
  // Check if the browser supports getUserMedia
  if (navigator.mediaDevices.getUserMedia) {
    // Request permission to access the microphone
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      // Save the stream reference for stopping the recording later
      recording = stream;
      
      // Start the recording process
      const recorder = new MediaStreamRecorder(stream);
      recorder.start();
      
      // Update the UI to show that we're recording
      micButton.innerHTML = "Stop Recording";
      transcriptBox.innerText = "";
      loader.classList.remove("hidden");
    }).catch(() => {
      alert("There was an error starting the recording.");
    });
  } else {
    alert("Your browser doesn't support getUserMedia.");
  }
}

// Function to stop recording
function stopRecording() {
  // Stop the recording process
  recording.stop();
  
  // Reset the UI to show that we've stopped recording
  micButton.innerHTML = "Start Recording";
  transcriptBox.innerText = "";
  loader.classList.add("hidden");
}

// Event listener for clicking the mic button
micButton.addEventListener("click", () => {
  if (recognizing) {
    stopRecognition();
  } else {
    startRecognition();
  }
});

// Function to start recognition
function startRecognition() {
  // Check if the SpeechRecognition API is supported
  if ("webkitSpeechRecognition" in window || "speechRecognition" in window) {
    // Create a new SpeechRecognition object
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    
    // Set the language and continuous mode
    recognition.lang = "en-US";
    recognition.continuous = true;
    
    // Handle the results of the recognition
    recognition.onspeechend = () => {
      stopRecognition();
    };
    
    // Start the recognition process
    recognition.start();
    
    // Update the UI to show that we're listening
    micButton.innerHTML = "Listening...";
    transcriptBox.innerText = "";
    loader.classList.remove("hidden");
  } else {
    alert("Your browser doesn't support the SpeechRecognition API.");
  }
}

// Function to stop recognition
function stopRecognition() {
  // Stop the recognition process
  recognition.stop();
  
  // Reset the UI to show that we've stopped listening
  micButton.innerHTML = "Start Listening";
  transcriptBox.innerText = "";
  loader.classList.add("hidden");
}

// Unit test for the startRecording function
describe("startRecording", () => {
  beforeEach(() => {
    jest.spyOn(window, "alert").mockImplementationOnce(() => {});
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  it("should call the getUserMedia function", async () => {
    const spy = jest.spyOn(navigator.mediaDevices, "getUserMedia");
    await startRecording();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  
  it("should set the recording property to the returned stream", async () => {
    const mockStream = {};
    jest.spyOn(navigator.mediaDevices, "getUserMedia").mockResolvedValueOnce(mockStream);
    await startRecording();
    expect(recording).toEqual(mockStream);
  });
  
  it("should throw an error if the browser doesn't support getUserMedia", async () => {
    delete navigator.mediaDevices.getUserMedia;
    await expect(startRecording()).rejects.toThrow("Your browser doesn't support getUserMedia.");
  });
});

// Unit test for the stopRecording function
describe("stopRecording", () => {
  it("should reset the recording property to null", () => {
    recording = {};
    stopRecording();
    expect(recording).toBeNull();
  });
});

// Unit test for the startRecognition function
describe("startRecognition", () => {
  beforeEach(() => {
    jest.spyOn(window, "alert").mockImplementationOnce(() => {});
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  it("should create a new SpeechRecognition object", () => {
    const spy = jest.spyOn(window, "webkitSpeechRecognition") || jest.spyOn(window, "SpeechRecognition");
    startRecognition();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  
  it("should set the language and continuous mode properties", () => {
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    startRecognition();
    expect(recognition.lang).toEqual("en-US");
    expect(recognition.continuous).toBeTruthy();
  });
  
  it("should handle the results of the recognition", () => {
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    startRecognition();
    recognition.dispatchEvent(new Event("speechend"));
    expect(transcriptBox.innerText).toEqual("");
  });
  
  it("should start the recognition process", () => {
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    startRecognition();
    expect(recognition.start).toHaveBeenCalledTimes(1);
  });
  
  it("should update the UI to show that we're listening", () => {
    startRecognition();
    expect(micButton.innerHTML).toEqual("Listening...");
    expect(transcriptBox.innerText).toEqual("");
    expect(loader.classList.contains("hidden")).toBeFalsy();
  });
  
  test("should throw an error if the SpeechRecognition API isn't supported", () => {
    jest.spyOn(globalThis, "navigator", "get").mockImplementation(() => ({
      mediaDevices: {},
    }));
  
    try {
      startRecognition();
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toEqual("Your browser doesn't support the SpeechRecognition API.");
    }
  });

// Unit test for the stopRecognition function
describe("stopRecognition", () => {
  it("should stop the recognition process", () => {
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    stopRecognition();
    expect(recognition.stop).toHaveBeenCalledTimes(1);
  });
  
  it("should reset the UI to show that we've stopped listening", () => {
    stopRecognition();
    expect(micButton.innerHTML).toEqual("Start Listening");
    expect(transcriptBox.innerText).toEqual("");
    expect(loader.classList.contains("hidden")).toBeTruthy();
  });
});