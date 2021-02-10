from datetime import datetime
from functools import wraps
from hashlib import sha1

import json
from bson import ObjectId
from flask import Flask, request, jsonify, json
import jwt
from flask_cors import CORS
from pymongo import MongoClient

secret = "the sky is blue"
client = MongoClient()
db = client.cars
collection = db.listings  # can switch to users for that info


class statistics:
    def __init__(self, carMake, count):
        self.carMake = carMake
        self.count = count


# upsert user
db.users.update_one({
    '_id': ObjectId('5ffcd26135312bec513e5ade')
}, {'$set': {
    '_id': ObjectId('5ffcd26135312bec513e5ade'),
    'name': 'roofus',
    'pass': sha1('doofus'.encode('utf-8')).hexdigest()
}
    }, upsert=True)

app = Flask(__name__)
CORS(app)


@app.route('/listings')
def listings():
    documents = collection.find()
    response = []
    for document in documents:
        document['_id'] = str(document['_id'])
        response.append(document)
    return jsonify({'listings': response})

@app.route('/listings/<id>')
def listing_by_id(id):
    target = str(id)
    documents = collection.find()
    response = "Not Found"
    for document in documents:
        if str(document['_id']) == target:
            response = str(document)
    return response + '\n'


@app.route('/listings', methods=['POST'])
def add_listing():
    print(request.headers)
    data = request.json
    print(data)
    make = data['make']
    model = data['model']
    year = data['year']
    price = data['price']
    seller = data['seller']

    db.listings.insert_one({
        'make': make,
        'model': model,
        'year': year,
        'price': price,
        'seller': seller,
        'sold': "false"
    })
    return 'success\n', 201

# Get /listings/stats - return the number of listings for each make (aggregate)
@app.route('/listings/stats')
def stats():
    output = {}
    jsonoutput = ""
    documentos = collection.find()
    for entry in documentos:
        if str(entry['make']) in output:
            output[str(entry['make'])] += 1
        else:
            output[str(entry['make'])] = 1
    for keys,values in output.items():
        jsonoutput += json.dumps({'make': keys, 'count': values}) + ","
    jsonoutput = jsonoutput[:-1]
    return "{\"stats\":[" + jsonoutput + "]}"

# Delete /listings/<_id> - mark a listing as sold
@app.route('/listings/<id>', methods=['DELETE'])
def sold_by_id(id):
    target = str(id)
    documents = collection.find()

    for document in documents:
        if str(document['_id']) == target:
            if str(document['sold']) == "false":
                db.listings.update_one(
                    {'_id': ObjectId(target)},  
                    {'$set': {"sold": "true"}})
            else:
                db.listings.update_one(
                    {'_id': ObjectId(target)},  
                    {'$set': {"sold": "false"}})
            return 'Success\n', 200
    return 'Not Found\n', 404


@app.route('/hello/<name>')
def hello_url(name):
    last = request.args.get('last', '')
    return f'hello {name} {last}\n'

@app.route('/create-account', methods=['POST'])
def create_account():
    print(request.headers)
    data = request.json
    print(data)
    name = data['name']
    _pass = data['pass'].encode('utf-8')
    hashpass = sha1(_pass).hexdigest()
    db.users.insert_one({
        'name': name,
        'pass': hashpass
    })
    return 'success\n', 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    name = data['name']
    _pass = data['pass'].encode('utf-8')
    hashpass = sha1(_pass).hexdigest()
    print(name, hashpass)
    user = db.users.find_one({
        'name': name,
        'pass': hashpass
    })
    print(user)
    if not user:
        return jsonify({'error': 'bad username or password'}), 404

    token = jwt.encode({
        'sub': name,
        'exp': datetime.now().timestamp() + 60 * 60
    }, secret)
    return jsonify({'token': token})

def login_required(f):
    @wraps(f)
    def wrapped(*args, **kwargs):
        token = request.headers.get('API-Token', None)
        if token is None:
            return jsonify({'error': 'API-Token header required'}), 401
        try:
            decoded = jwt.decode(token, secret, algorithms=['HS256'])
        except jwt.exceptions.InvalidSignatureError:
            return jsonify({'error': 'bad token signature'}), 403
        if decoded['exp'] <= datetime.now().timestamp():
            return jsonify({'error': 'expired token'}), 403
        kwargs['token'] = decoded
        return f(*args, **kwargs)
    return wrapped

@app.route('/logged-in-hello')
@login_required
def logged_in_hello(token=None):
    return f'hello {token["sub"]}\n'

app.run()
