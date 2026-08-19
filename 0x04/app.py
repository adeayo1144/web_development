#!/usr/bin/python3
"""an entry point to the application"""
from flask import Flask, jsonify
from flask_cors import CORS
from routes.auth import app_auth
from routes.serve import serve

app = Flask(__name__)
CORS(app)

app.register_blueprint(app_auth, url_prefix="/api/v1/") 
app.register_blueprint(serve)

@app.errorhandler(404)
def not_found(error):
    """Not found error"""
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(403)
def forbidden(error):
    """Forbidden error"""
    return jsonify({"error": "Forbidden"}), 403

if __name__ == "__main__":
    app.run(host="0.0.0.0", port = 5000, debug=True)

  