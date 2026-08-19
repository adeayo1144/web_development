#!/usr/bin/python3
"""Database module for the application"""
from model.base import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from model.user import User
from model.movie import Movie
from model.watch import Watch


class DB:
    """Database class to manage the connection and sessions"""
    __engine = None
    __session = None

    def __init__(self, host, user, db_name, password=None):
        self.__engine = create_engine(f'mysql+pymysql://{user}:{password}@{host}:3306/{db_name}')
        
        

    def create_table(self):
        """Create tables in the database"""
        Base.metadata.create_all(self.__engine)
        session = sessionmaker(bind=self.__engine, expire_on_commit=False)
        self.__session = scoped_session(session)
        
    def close(self):
        """Close the database session"""
        if self.__session:
            self.__session.remove()

    def save(self):
        """Commit the current session to the database"""
        self.__session.commit()

    def get_session(self):
        """Get the current database session"""
        return self.__session