#!/usr/bin/python

"""JWT authentication middleware for the API"""

from flask import current_app, request, jsonify
from functools import wraps

from model import storage
from model.user import User

import jwt


def jwt_required(f):
    """Decorator to protect routes that require authentication"""

    @wraps(f)
    def decorated(*args, **kwargs):

        auth_header = request.headers.get("Authorization", "")
        parts = auth_header.split(" ")
        token = parts[1] if len(parts) == 2 and parts[0].lower() == "bearer" else None

        print(token)

        if not token:
            return jsonify({"message": "Token is missing!"}), 401

        try:
            data = jwt.decode(
                token,
                current_app.config["JWT_SECRET_KEY"],
                algorithms=["HS256"]
            )

            current_user_id = data["id"]

            session = storage.get_session()

            user = session.query(User).filter_by(
                id=current_user_id
            ).first()

            if not user:
                return jsonify({"message": "User not found"}), 404

        except Exception as e:
            print("JWT ERROR:", str(e))
            return jsonify({
                "message": "Token is invalid",
                "error": str(e)
            }), 401

        return f(**kwargs)

    return decorated


def create_auth_token(payload):
    """Generate a JWT token for the authenticated user"""

    try:
        secret_key = current_app.config.get("JWT_SECRET_KEY")

        if not secret_key:
            raise RuntimeError("JWT_SECRET_KEY is not configured")

        return jwt.encode(
            payload,
            secret_key,
            algorithm="HS256"
        )

    except Exception as e:
        print("JWT CREATE ERROR:", str(e))
        return None


def decode_auth_token(token):
    """Decode the JWT token"""

    try:
        payload = jwt.decode(
            token,
            current_app.config["JWT_SECRET_KEY"],
            algorithms=["HS256"]
        )

        return payload

    except Exception as e:
        print("JWT DECODE ERROR:", str(e))
        return None