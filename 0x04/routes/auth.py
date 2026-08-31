#!/usr/bin/python3
"""authentication routes for the API"""
from flask import Blueprint, request, session
from model import storage
from model.user import User
from model.movie import Movie
from middleware.auth import create_auth_token, jwt_required, decode_auth_token
from uuid import uuid4
from flask import request, make_response
from werkzeug.utils import secure_filename
import os
from flask_mail import Message
import asyncio

app_auth = Blueprint("app_auth", __name__)



@app_auth.route("/register", methods=["POST"], strict_slashes=False)
def register():

    data = request.get_json()

    required_fields = ["firstname", "lastname", "email", "password",]
    for field in required_fields:
        if field not in data:
            return {"message": f"{field.capitalize()} is required"}, 400

    session = storage.get_session()
    user = session.query(User).filter_by(email=data.get("email")).first()
    if user:
        return {"message": "User already exists"}, 400

    new_user = User(
        email=data.get("email"),
        firstname=data.get("firstname"),
        lastname=data.get("lastname")
    )
    new_user.hash_password(data.get("password"))
    session.add(new_user)
    session.commit()

    from app import mail
    msg = Message(
        subject="Welcome to Movie App",
        sender=os.getenv("MAIL_USERNAME"),
        recipients=[new_user.email],
        body=f"Hello {new_user.firstname},\n\nThank you for registering at Movie App. We're excited to have you on board!\n\nBest regards,\nMovie App Team"
    )
    mail.send(msg)
    return {"message": "User created successfully"}, 201


@app_auth.route("/login", methods=["POST"], strict_slashes=False)
def login():  

    data = request.get_json()

    if data is None or "email" not in data.keys() \
            or "password" not in data.keys():
        return {"message": "Email and password are required"}, 400

    user = storage.get_session().query(User).filter_by(email=data.get("email")).first()

    if user and user.check_password(data.get("password")):
        token = create_auth_token(user.to_dict())

        if token is None:
            return {"message": "Authentication service is not configured"}, 500

        response = make_response({
            "message": "Login successful",
            "redirect": "/dashboard",
            "token": token
        }, 200)
        return response

    return {"message": "Invalid credentials"}, 401
   
@app_auth.route("/movie", methods=["POST"], strict_slashes=False)
@jwt_required
def add_movie():
    data = request.get_json(silent=True) or request.form.to_dict()

    session = storage.get_session()

    for field in ["title", "producer", "release_date", "user_id"]:
        if field not in data:
            return {"message": f"{field.capitalize()} is required"}, 400
    user = decode_auth_token(data.get("user_id"))
    if not user:
        return {"message": "Invalid user token"}, 401

    thumbnail = request.files.get("thumbnail")
    thumbnail_path = None
    if thumbnail and thumbnail.filename:
        allowed_extensions = {"jpg", "jpeg", "png", "gif", "webp"}
        extension = thumbnail.filename.rsplit(".", 1)[-1].lower()
        if extension not in allowed_extensions:
            return {"message": "Thumbnail must be an image file"}, 400

        upload_directory = os.path.join(
            os.path.dirname(os.path.dirname(__file__)), "static", "uploads"
        )
        os.makedirs(upload_directory, exist_ok=True)
        filename = f"{uuid4()}.{extension}"
        thumbnail.save(os.path.join(upload_directory, secure_filename(filename)))
        thumbnail_path = f"/static/uploads/{filename}"

    new_movie = Movie(
        title=data.get("title"),
        producer=data.get("producer"),
        release_date=data.get("release_date"),
        thumbnail=thumbnail_path,
        user_id=user.get("id")
    )

    session.add(new_movie)
    session.commit()

    return {"message": "Movie added successfully", "thumbnail": thumbnail_path}, 201



@app_auth.route("/movies", methods=["GET"], strict_slashes=False)
@jwt_required
def get_movies():
    session = storage.get_session()
    user = decode_auth_token(request.headers.get("Authorization", "").split(" ")[-1])
    movies = session.query(Movie).filter_by(user_id=user.get("id")).all()
    return {"movies": [movie.to_dict() for movie in movies]}, 200


@app_auth.route("/movie/<movie_id>", methods=["PUT"], strict_slashes=False)
@jwt_required
def update_movie(movie_id):
    token = request.headers.get("Authorization", "").split(" ")[-1]
    user = decode_auth_token(token)
    session = storage.get_session()
    movie = session.query(Movie).filter_by(id=movie_id).first()

    if not movie:
        return {"message": "Movie not found"}, 404
    if not user or movie.user_id != user.get("id"):
        return {"message": "You can only edit your own movies"}, 403

    data = request.get_json(silent=True) or request.form.to_dict()
    for field in ["title", "producer", "release_date"]:
        if field in data:
            setattr(movie, field, data[field])

    thumbnail = request.files.get("thumbnail")
    if thumbnail and thumbnail.filename:
        allowed_extensions = {"jpg", "jpeg", "png", "gif", "webp"}
        extension = thumbnail.filename.rsplit(".", 1)[-1].lower()
        if extension not in allowed_extensions:
            return {"message": "Thumbnail must be an image file"}, 400
        upload_directory = os.path.join(
            os.path.dirname(os.path.dirname(__file__)), "static", "uploads"
        )
        os.makedirs(upload_directory, exist_ok=True)
        filename = secure_filename(f"{uuid4()}.{extension}")
        thumbnail.save(os.path.join(upload_directory, filename))
        movie.thumbnail = f"/static/uploads/{filename}"

    movie.updated_at = __import__("datetime").datetime.now(
        __import__("datetime").timezone.utc
    ).isoformat()
    session.commit()
    return {"message": "Movie updated successfully", "movie": movie.to_dict()}, 200


@app_auth.route("/movie/<movie_id>", methods=["DELETE"], strict_slashes=False)
@jwt_required
def delete_movie(movie_id):
    token = request.headers.get("Authorization", "").split(" ")[-1]
    user = decode_auth_token(token)
    session = storage.get_session()
    movie = session.query(Movie).filter_by(id=movie_id).first()

    if not movie:
        return {"message": "Movie not found"}, 404
    if not user or movie.user_id != user.get("id"):
        return {"message": "You can only delete your own movies"}, 403

    session.delete(movie)
    session.commit()
    return {"message": "Movie deleted successfully"}, 200