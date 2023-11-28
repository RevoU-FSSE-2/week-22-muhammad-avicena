from user.constants import UserRole
from flask import request
import jwt, os
from functools import wraps

def decode_jwt(token):
    try:
        return jwt.decode(token, os.getenv('SECRET_KEY'), algorithms='HS256')
    except jwt.ExpiredSignatureError:
        print("Expired signature error")
        return None
    except jwt.InvalidTokenError:
        print("Invalid token error")
        return None

def role_required(required_role):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return {"error": "Token is missing"}, 401

            parts = auth_header.split()
            if len(parts) != 2 or parts[0].lower() != 'bearer':
                return {"error": "Token is not valid"}, 401

            token = parts[1]

            decoded_token = decode_jwt(token)
            if decoded_token is None:
                return {"error": "Token is not valid or expired"}, 401

            user_role = decoded_token.get("role")
            
            if user_role == required_role:
                return fn(decoded_token.get("user_id"), *args, **kwargs)
            else:
                return {"error": f"Unauthorized role: {required_role}"}, 403
        return wrapper
    return decorator

admin_required = role_required(UserRole.ADMIN.value)
user_required = role_required(UserRole.USER.value)