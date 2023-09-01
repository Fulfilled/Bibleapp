from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

@app.route('/api/recordings', methods=['POST'])
def receive_and_save_recording():
    try:
        audio_file = request.files['audio']
        if audio_file:
            # Set the directory where you want to save audio files
            save_directory = 'C:/Users/ofone/Desktop/Project Backup/Code/speech.wav'
            os.makedirs(save_directory, exist_ok=True)
            
            # Save the audio file
            audio_file_path = os.path.join(save_directory, 'recorded_audio.wav')
            audio_file.save(audio_file_path)
            
            return jsonify({"message": "Recording received and saved successfully"})
        else:
            return jsonify({"message": "No audio data received"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def home():
    return "Server is up and running!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
