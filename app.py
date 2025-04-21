
from flask import Flask, render_template, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)

# Enable CORS for all routes and origins
CORS(app)

@app.route('/')
def home():
    # If index.html is in static folder
    return send_from_directory(os.path.join(app.root_path, 'static'), 'index.html')

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))  # Default to 3000 if PORT is not set
    app.run(host="0.0.0.0", port=port, debug=True)