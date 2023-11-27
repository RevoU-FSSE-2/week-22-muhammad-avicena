from user.constants import UserRole
from infrastructure.db import db
from sqlalchemy import Enum

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(80), nullable=False)
    role = db.Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    createdDate = db.Column(db.DateTime, nullable=False)