from flask import Blueprint

home_blueprint = Blueprint("home", __name__)    

@home_blueprint.route('/')
def home():
    return {"message": "Developed by M.A.R", "success": True}

