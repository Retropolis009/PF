from flask import Flask, request, jsonify, session
from datetime import datetime

# Make sure to import CORS
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = 'dev_key_123'

# Explicitly allow the React Dev server and allow cookies (credentials)
CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

@app.route('/api/tasks', methods=['GET', 'POST'])
def handle_tasks():
    if 'tasks' not in session:
        session['tasks'] = []

    if request.method == 'POST':
        data = request.json
        new_task = {
            "id": datetime.now().timestamp(), # Unique ID based on time
            "text": data.get("text"),
            "priority": data.get("priority", "Low"),
            "time": datetime.now().strftime("%I:%M %p"), # Example: 02:30 PM
            "completed": False
        }
        
        # Update session
        temp_list = session['tasks']
        temp_list.insert(0, new_task) # Add new tasks to the top
        session['tasks'] = temp_list
        session.modified = True 
        return jsonify(new_task)

    return jsonify(session['tasks'])

@app.route('/api/tasks/<float:task_id>', methods=['DELETE'])
def delete_task(task_id):
    session['tasks'] = [t for t in session['tasks'] if t['id'] != task_id]
    session.modified = True
    return jsonify({"success": True})

if __name__ == '__main__':
    app.run(debug=True, port=5000)