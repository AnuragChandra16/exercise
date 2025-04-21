# from flask import Flask, render_template

# app = Flask(__name__)

# @app.route('/')
# def index():
#     return render_template('index.html')

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, render_template
from flask_cors import CORS
import os

app = Flask(__name__)

# Enable CORS for all routes and origins
CORS(app)

@app.route("/")
def home():
    return render_template("index.html")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))  # Default to 5000 if PORT is not set
    app.run(host="0.0.0.0", port=port)
