from flask import Blueprint, request
from auth.utils import user_required
import jwt, os
from user.models import User
from auth.utils import decode_jwt

user_blueprint = Blueprint("user", __name__)

@user_blueprint.route("", methods=["GET"])
@user_required
def get_user_profile():
    authorization_header = request.headers.get('Authorization')
    token = authorization_header.split("Bearer ")[1] if "Bearer " in authorization_header else None
    payload = decode_jwt(token)
    print("Decoded Payload:", payload)
    if not payload:
        return {"error": "Token tidak valid"}, 401

    user_id = payload.get("user_id")

    if not user_id:
        return {"error": "User ID tidak ditemukan"}, 401

    user = User.query.get(user_id)

    if not user:
        return {"error": "User tidak ditemukan!"}, 404
    
    return {
        'id': user.id,
        'username': user.username,
        'bio': user.bio,
    }