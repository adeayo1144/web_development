#!/usr/bin/python
"""jwt authentication middleware for the API"""
from flask import Config, request, jsonify
from functools import wraps
from model import storage
import jwt

def jwt_reqyiured(f):
    """decorator to protect routes that require authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        if not token:
            return jsonify({"message": "Token is missing!"}), 401
        try:
            data = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms = ["HS256"])
            current_user_id = data['id']
            session = storage.get_session()
            user = session.query(user).filter_by(id=current_user_id).first()
            if not user:
                return jsonify({"message":"User not found"}), 404
        except Exception as e:
            return jsonify({"message": "Token is invalid:", "error": str(e)}, 401)
        return f(current_user_id,*args, **kwargs)
    return decorated

def create_auth_token(payload):
    """generate a JWT token for the authenticated user"""
    try:
        token = jwt.encode(payload, Config.JWT_SECRET_KEY,algorithm = "HS256", expires_in=Config.JWT_ACCESS_TOEKN_EXPIRES)
        return token
    except Exception as e:
        return None

def decode_auth_token(token):
    """decode the JWT token to get the user 1D"""
    try:
        payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms = ["HS256"])
        return payload['id']
    except Exception as e:
        return None