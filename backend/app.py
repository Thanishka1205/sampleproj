from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)

# In-memory store (replace with DB for production)
notes = []


@app.route('/notes', methods=['GET'])
def get_notes():
    return jsonify(notes)


@app.route('/notes', methods=['POST'])
def add_note():
    data = request.json
    if not data or not data.get('text', '').strip():
        return jsonify({"error": "Note text is required"}), 400

    note = {
        "id": str(uuid.uuid4()),
        "text": data['text'].strip(),
        "created_at": datetime.utcnow().isoformat() + "Z"
    }
    notes.append(note)
    return jsonify(note), 201


@app.route('/notes/<string:note_id>', methods=['DELETE'])
def delete_note(note_id):
    global notes
    original_len = len(notes)
    notes = [n for n in notes if n['id'] != note_id]
    if len(notes) == original_len:
        return jsonify({"error": "Note not found"}), 404
    return jsonify({"message": "Deleted successfully"})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
