#!/usr/bin/python3
"""a watch movie model class"""
from .base import Base
from sqlalchemy import String, Column, ForeignKey
from uuid import uuid4
from datetime import datetime
from sqlalchemy.orm import relationship

class Watch(Base):
    """watch movie fields listed below"""
    __tablename__ = "watches"
    id = Column(String(50),primary_key=True, default=lambda: str(uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"))
    movie_id = Column(String(36), ForeignKey("movies.id"))
    created_at = Column(String(30),
                        default=lambda: datetime.now(
                        datetime.timezone.utc).isoformat())
updated_at = Column(String(30), nullable=True)
user = relationship("User", back_populates= "watches", cascade="all, delete-orphan")
movie = relationship("Movie", back_populates="watches")
                        