#!/usr/bin/pyhton3
""" a user model class"""
from sqlalchemy import String, Column
from uuid import uuid4
from datetime import datetime, timezone
from .base import Base
from bcrypt import hashpw, gensalt, checkpw

class User(Base):
    """user fields listed below"""
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, default=lambda: str(uuid4()))
    firstname = Column(String(30))
    lastname = Column(String(30))
    email = Column(String(50), unique=True)
    token = Column(String(128), nullable=True)
    password = Column(String(128))
    created_at = Column(String(30), default=lambda: datetime.now(
                                    timezone.utc).isoformat())
    updated_at = Column(String(30), nullable=True)

    def check_password(self, password):
        """check if the provided password matches the stored password"""
        return checkpw(password.encode('utf-8'), 
                        self.password.encode('utf-8'))

    def hash_password(self, password):
        """hash the provided password and store it"""
        self.password = hashpw(password.encode('utf-8'), 
                                gensalt()).decode('utf-8')

    def to_dict(self):
        """convert the user object to a dictionary"""
        return {
            "id": self.id,
            "firstname": self.firstname,
            "lastname": self.lastname,
            "email": self.email,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }