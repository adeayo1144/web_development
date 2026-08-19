#!/usr/bin/python3
"""authentication routes for the API"""
from flask import Blueprint, request, render_template
from model import storage
from model.user import User

serve = Blueprint('serve', __name__)


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
    return render_template("dashboard.html")




