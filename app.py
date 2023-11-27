from flask import Flask
from infrastructure.db import db, db_init
from home.apis import home_blueprint
from auth.apis import auth_blueprint
import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
db.init_app(app)

app.register_blueprint(home_blueprint, url_prefix="/")
app.register_blueprint(auth_blueprint, url_prefix="/api/v1/auth")
# app.register_blueprint(user_blueprint, url_prefix="/user")
# app.register_blueprint(tweet_blueprint, url_prefix="/tweet")

# with app.app_context():
#     db_init()