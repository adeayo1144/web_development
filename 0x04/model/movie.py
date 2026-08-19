#!/usr/bin/python3
"""a movie model class"""
from .base import Base
from sqlalchemy import String, Column
from uuid import uuid4
from datetime import datetime


class Movie(Base):
    """movie fields listed below"""
    __tablename__ = "movies"

    id = Column(String(50),primary_key=True, default=lambda: str(uuid4()))
    title = Column(String(100))
    director = Column(String(50))
    release_year = Column(String(4))
    genre = Column(String(30))
    created_at = Column(String(30),
                        default=lambda: datetime.now(
                            datetime.timezone.utc).isoformat())
updated_at = Column(String(30), nullable = True)