#!/usr/bin/python3
"""a module that initialize db storage"""
from db.config import DB
import os

args = [os.getenv("DB_HOST", "localhost"),
        os.getenv("USER", "root"),
        os.getenv("DATABASE_NAME", "hbnb_dev_db"),
        os.getenv("PASSWORD", "Oluwapelumi1144")]

storage = DB(*args)
storage.create_table()