#!/usr/bin/python3
""" app configuration file"""
import os
from datetime import timedelta


class Config:
    DB_HOST= os.getenv("DB_HOST")
    USER= os.getenv("USER")
    DATABASE_NAME= os.getenv("DATABASE_NAME")
    PASSWORD= os.getenv("PASSWORD")
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = os.getenv("JWT_ACCESS_TOKEN_EXPIRES")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    MAIL_SERVER = os.getenv("MAIL_SERVER")
    MAIL_PORT = os.getenv("MAIL_PORT")
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS")
    

    @classmethod
    def init_app(cls, app):
        pass
