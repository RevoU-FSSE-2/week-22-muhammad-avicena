from flask import Flask
from flask_cors import CORS
from flask_talisman import Talisman

from infrastructure.db import db, db_init
from home.apis import home_blueprint
from auth.apis import auth_blueprint
from user.apis import user_blueprint
from todolist.apis import todolist_blueprint
import os

app = Flask(__name__)
CORS(app)
Talisman(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
db.init_app(app)

app.register_blueprint(home_blueprint, url_prefix="/")
app.register_blueprint(auth_blueprint, url_prefix="/api/v1/auth")
app.register_blueprint(user_blueprint, url_prefix="/api/v1/users")
app.register_blueprint(todolist_blueprint, url_prefix="/api/v1/todos")

# with app.app_context():
#     db_init()