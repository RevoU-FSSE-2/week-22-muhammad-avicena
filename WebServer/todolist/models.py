from todolist.constants import Priority, Status
from infrastructure.db import db
from sqlalchemy import Enum
from datetime import datetime, timedelta

class Todolist(db.Model):
    def default_due_date():
        return datetime.utcnow() + timedelta(days=7)
     
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  
    activity = db.Column(db.String(255), unique=True, nullable=False)
    priority = db.Column(Enum(Priority), default=Priority.LOW, nullable=False)
    status = db.Column(Enum(Status), default=Status.NOT_STARTED, nullable=False)
    dueDate = db.Column(db.DateTime, nullable=False)
    createdDate = db.Column(db.DateTime, nullable=False)
