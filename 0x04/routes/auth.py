#!/usr/bin/python3
"""authentication routes for the API"""
from flask import Blueprint, request
from model import storage
from model.user import User
from middleware.auth import create_auth_token, decode_auth_token
from uuid import uuid4

app_auth = Blueprint("app_auth", __name__)

@app_auth.route("/login", methods = ["POST"], strict_slashes=False)
def login():
    """login route"""
    data = request.get_json()
    if data is None or "email" not in data.keys()\
        or "password" not in data.keys():
        return {"message": "Email and password are required"}, 400
    user = storage.get_session().query(User).filter_by(email=data.get("email")).first()
    if user and user.check_password(data.get("password")):
        token = create_auth_token(data)
        return {"message": "Login succesful", "token": token, "redirect": "/dashboard"}, 200
    return {"message": "Invalid credentials"}, 401
       
        

@app_auth.route("/register", methods=["POST"], strict_slashes=False)
def register():
    """register route"""
    data = request.get_json()
    required_fields = ["firstname", "lastname", "email", "password"]
    for field in required_fields:
        if field not in data.keys():
            return {"message": f"{field.capitalize()} is required"}, 400
    session = storage.get_session()
    user = session.query(User).filter_by(email=data.get("email")).first()
    if user:
        return {"message": "Email already exists"}, 400
    new_user = User(
        email=data.get("email"),
        firstname=data.get("firstname"),
        lastname=data.get("lastname"),
    )
    new_user.hash_password(data.get("password"))
    session.add(new_user)
    session.commit()
    return {"message": "User registered successfully"}, 201

@app_auth.route('/change-password', methods=['POST'], strict_slashes=False)
def change_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('new_password')
    
    if not token or not new_password:
        return {"message": "Missing token or new password"}, 400
        
    session = storage.get_session()
    user = session.query(User).filter_by(token=token).first()
    
    if not user:
        return {"message": "Invalid token"}, 404
        
   
    user.token = token  
    session.commit()
    
    return {"message": "Password changed successfully","redirect": "/login"}, 200


@app_auth.route("/forgot-password", methods=["POST"], strict_slashes=False)
def forgot_password():
    data = request.get_json()

    if "email" not in data:
        return {"message": "Email is required"}, 400

    session = storage.get_session()
    user = session.query(User).filter_by(email=data.get("email")).first()

    if not user:
        return {"message": "User not found"}, 404
    token = uuid4().hex

    user.token = token
    session.commit()

    return {"message": "Password reset successfully", "token": token}, 200

@app_auth.route('/logout')
def logout():
    return{
        "message": "logged out succesfully", "redirect": "/login"
    }



