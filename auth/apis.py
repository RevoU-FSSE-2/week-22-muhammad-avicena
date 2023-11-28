from flask import Blueprint, request
from user.models import User
from infrastructure.db import db
import jwt, os
from datetime import datetime, timedelta
from common.bcrypt import bcrypt
from marshmallow import Schema, fields, ValidationError

auth_blueprint = Blueprint("auth", __name__)

class UserRegistrationSchema(Schema):
    username = fields.String(required=True)
    password = fields.String(required=True)
    email = fields.Email(required=True)

@auth_blueprint.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    schema = UserRegistrationSchema()
    try:
        data = schema.load(data)
    except ValidationError as err:
        return {"success": False, "message": err.messages }, 400
    
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], password=hashed_password, email=data['email'], createdDate=datetime.utcnow())
    db.session.add(new_user)
    db.session.commit()

    return {
        "success" : True,
        "message": "Successfully register a user",
        "data": new_user.id
    }

@auth_blueprint.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data["username"]
    password = data["password"]

    user = User.query.filter_by(username=username).first()
    if not user:
        return {"error": "User or password is not valid"}, 400
    
    valid_password = bcrypt.check_password_hash(user.password, password)
    if not valid_password:
        return {"error": "User or password is not valid"}, 400
    
    payload = {
        'user_id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role.value,
        'exp': datetime.utcnow() + timedelta(minutes=60)
    }
    token = jwt.encode(payload, os.getenv('SECRET_KEY'), algorithm="HS256")
    
    return {
        'success': True,
        'message': 'Successfully login',
        'data': {
            'token': token,
            'username': user.username,
            'email': user.email,
            'id': user.id,
            'role': user.role.value
        }
    }