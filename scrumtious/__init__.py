""" scrumtious/__init__.py
"""
from os import environ

from flask import Flask
from flask_pymongo import PyMongo
from flask_redis import FlaskRedis
from flask_socketio import SocketIO

# from helpers import csCompile
#
# # Compile client files
# csCompile('scrumtious/cs', 'scrumtious/static/js')

# Set up app
app = Flask(__name__)
app.debug = True

app.config['MONGO_URI'] = environ['MONGODB_URI']
mongo = PyMongo(app)

app.config['REDIS_URL'] = environ['REDISCLOUD_URL']
redis = FlaskRedis(app)

socketio = SocketIO(app)

# Set up routes, socket
import scrumtious.routes, scrumtious.socket
