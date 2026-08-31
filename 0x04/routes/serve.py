#!/usr/bin/python3
"""authentication routes for the API"""
from flask import Blueprint, request, render_template, session, redirect, url_for
from model import storage
from model.user import User
from model.movie import Movie
from middleware.auth import decode_auth_token

serve = Blueprint('serve', __name__)

@serve.route("/", methods=["GET"], strict_slashes=False)
def home_route():
    """Home page"""
    return render_template("index.html")


@serve.route("/login", methods=["GET"], strict_slashes=False)
def login_route():
    """check route"""
    return render_template("login.html")

@serve.route("/register", methods=["GET"], strict_slashes=False)
def register_route():
    """check route"""
    return render_template("register.html")

@serve.route("/forgot-password", methods=["GET"], strict_slashes=False)
def forgotpassword_route():
    """check route"""
    return render_template("forgotpassword.html")

@serve.route("/change-password", methods=["GET"], strict_slashes=False)
def changepassword_route():
    """check route"""
    return render_template("changepassword.html")

@serve.route("/dashboard", methods=["GET"], strict_slashes=False)
def dashboard_route():
    token = request.cookies.get("access_token")

    if not token:
        print("NO TOKEN FOUND")
        return redirect(url_for("serve.login_route"))

    user = decode_auth_token(token)

    if not user:
        print("TOKEN COULD NOT BE DECODED")
        return redirect(url_for("serve.login_route"))
    
    movie_count = storage.get_session().query(Movie).filter(Movie.user_id==user.get('id')).all().count()
    return render_template("dashboard.html", user=user, movie_count=movie_count)

@serve.route("/movie", methods=["GET"], strict_slashes=False)
def movie_route():
    token = request.cookies.get("access_token")


    if not token:
        print("NO TOKEN FOUND")
        return redirect(url_for("serve.login_route"))

    user = decode_auth_token(token)

    if not user:
        return redirect(url_for("serve.login_route"))

    return render_template("movie.html", user=user)



@serve.route('/logout')
def logout():
    session['user'] = None
    return redirect(url_for('serve.login_route'))



