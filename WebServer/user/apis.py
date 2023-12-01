from flask import Blueprint
from auth.utils import user_required
from user.models import User

user_blueprint = Blueprint("user", __name__)

@user_blueprint.route("", methods=["GET"])
@user_required
def get_user_profile(user_id):

    if not user_id:
        return {"error": "User not found", 'success': False }, 404

    user = User.query.get(user_id)

    if not user:
         return {"error": "User not found", 'success': False }, 404
    
    return {
        'success': True,
        'message': 'Successfully get user profile',
        'data': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role.value
        }
    }