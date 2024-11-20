import json
import os

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

from flask import Flask
from flask import jsonify
from flask import request
from flask_cors import CORS
from flask import make_response

# develop_mode
dev_mode = False

# import utils
from utils import generate_clipboard, generate_key

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Fetch the service account key JSON file contents
if dev_mode:
    cred = credentials.Certificate("credentials.json")
else:
    service_key = json.loads(os.environ["SERVICE_ACCOUNT_KEY"])
    cred = credentials.Certificate(service_key)

firebase_admin.initialize_app(
    cred,
    {"databaseURL": "https://clipboard-c6b51-default-rtdb.firebaseio.com/"}
)



# Default route
@app.route("/", methods=["GET"])
def home():
    return "Hello World"


# Get clipboard data and add new data
@app.route("/api", methods=["GET", "POST"])
def api():
    if request.method == "GET":
        ref = db.reference("/")
        # read ref as json data to a list
        snapshot = ref.order_by_key().get()
        clipboard = generate_clipboard(snapshot)

        # print(clipboard)

        if not clipboard:
            return jsonify({"msg": "No data found in the database."}), 404

        return jsonify(clipboard)

    elif request.method == "POST":
        # check if the post request has the json data
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400

        # get the content from the json data
        data = request.get_json()
        clip = data["body"]

        print(clip)

        # get the database reference
        ref = db.reference("/")
        snapshot = ref.order_by_key().get()

        clipboard = generate_clipboard(snapshot)
        new_key = generate_key(clipboard)
        print(new_key)

        try:
            # update the database
            ref.child(str(new_key)).set({"data": clip})
        except:
            return (
                jsonify({
                    "msg":
                    "Error while updating the database. Try again. Contact developer if problem persists at https://github.com/aviiciii ."
                }),
                500,
            )

        return jsonify({"msg": "Data added to the database."}), 200

    else:
        return (
            jsonify({
                "msg":
                "Method not allowed. The '/api' route accepts only GET and POST."
            }),
            405,
        )


# Delete clipboard data
@app.route("/delete/<int:key>", methods=["GET"])
def delete(key):
    if request.method == "GET":
        # get the database reference
        ref = db.reference("/")

        # read ref as json data
        snapshot = ref.order_by_key().get()
        clipboard = generate_clipboard(snapshot)

        # remove null in clipboard dict
        clipboard = {k: v for k, v in clipboard.items() if v is not None}

        # print(clipboard.keys())
        # check if the key exists
        if key not in clipboard.keys():
            return jsonify({"msg": "Key not found in the database."}), 404

        # delete the key
        try:
            # print('Deleting key: ', key)
            # print(clipboard.keys())
            ref.child(str(key)).delete()
            return jsonify({"msg": "Data deleted from the database."}), 200
        except:
            return (
                jsonify({
                    "msg":
                    "Error while deleting the data. Try again. Contact developer if problem persists at https://github.com/aviiciii ."
                }),
                500,
            )

    return jsonify({"msg": "Error"}), 500


# ---Error handlers---
@app.errorhandler(404)
def page_not_found(e):
    return (
        jsonify({
            "msg":
            "Page not found. Try '/api' route for requests. Contact developer at https://github.com/aviiciii ."
        }),
        404,
    )


@app.errorhandler(500)
def internal_server_error(e):
    return (
        jsonify({
            "msg":
            "Internal server error. Raise issue at https://github.com/aviiciii/clipboard/issues ."
        }),
        500,
    )


@app.errorhandler(405)
def method_not_allowed(e):
    return (
        jsonify({
            "msg":
            "Method not allowed. The '/api' route accepts only GET and POST. The '/delete' route accepts only DELETE"
        }),
        405,
    )


@app.errorhandler(400)
def bad_request(e):
    return jsonify({"msg": "Bad request"}), 400


@app.errorhandler(403)
def forbidden(e):
    return jsonify({"msg": "Forbidden"}), 403


