from flask import Flask
from flask import jsonify
from flask import request
import random

app = Flask(__name__)


@app.route('/')
def main():
    return "It's Worked"

@app.route('/predict', methods=['POST'])
def predict():
    content = request.get_json()
    routes = content['routes']  # [[1.2, 4.5], [1.2, 4.5], [1.2, 4.5]]
    persona = content['persona']  # { "age": 17, weather: 1 }
    return jsonify([random.randrange(0, 2) for x in range(len(routes))])
