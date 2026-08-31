#!/usr/bin/python3
"""an entry point to the application"""
from flask import Flask, jsonify
from flask_cors import CORS
from routes.auth import app_auth
from routes.serve import serve
import os
from config import Config
from flask_mail import Mail

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY')
CORS(app)


app.register_blueprint(app_auth, url_prefix="/api/v1/") 
app.register_blueprint(serve)
config_name = "development"
app.config.from_object(Config)
Config.init_app(app)
mail = Mail(app)


@app.errorhandler(404)
def not_found(error):
    """Not found error"""
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(403)
def forbidden(error):
    """Forbidden error"""
    return jsonify({"error": "Forbidden"}), 403

@app.errorhandler(500)
def internal_server_error(error):
    """Return API errors as JSON instead of an HTML page."""
    return jsonify({"message": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port = 5000, debug=True)

  