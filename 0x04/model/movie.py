#!/usr/bin/python3
"""a movie model class"""
from .base import Base
from sqlalchemy import String, Column, ForeignKey
from uuid import uuid4
from datetime import datetime, timezone


class Movie(Base):
    """movie fields listed below"""
    __tablename__ = "movies"

    id = Column(String(50),primary_key=True, default=lambda: str(uuid4()))
    title = Column(String(100))
    producer = Column(String(50))
    release_date = Column(String(20))
    thumbnail = Column(String(255), nullable=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=False)
    created_at = Column(String(30),
                        default=lambda: datetime.now(timezone.utc).isoformat())
    updated_at = Column(String(30), nullable = True)

    def to_dict(self):
        """returns a dictionary representation of the movie"""
        return {
            "id": self.id,
            "title": self.title,
            "producer": self.producer,
            "release_date": self.release_date,
            "thumbnail": self.thumbnail,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }