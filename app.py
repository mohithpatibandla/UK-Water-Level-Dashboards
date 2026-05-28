from flask import Flask, render_template, jsonify
import json
import os

app = Flask(__name__)

# Load dam data from JSON
def load_dam_data():
    with open('uk_dam_data/live.json') as f:
        return json.load(f)

@app.route('/')
def index():
    data = load_dam_data()
    return render_template('index.html', data=data)

@app.route('/api/data')
def api_data():
    return jsonify(load_dam_data())

if __name__ == '__main__':
    app.run(debug=True)
