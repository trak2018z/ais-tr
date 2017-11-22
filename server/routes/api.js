const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// Connect
const connection = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017/inventory', (err, db) => {
        if (err) return console.log(err);

        closure(db);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

router.get('/users', (req, res) => {
    connection((db) => {
        db.collection('users')
            .find()
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

router.post('/users', (req, res) => { 
    connection((db) => {
            db.collection('users')
            .insert(req.body)//.deleteMany({})//
            .catch((err) => {
                sendError(err, res);
            }) 
    });    
});

router.get('/items', (req, res) => {
    connection((db) => {
        db.collection('items')
            .find()
            .toArray()
            .then((items) => {
                response.data = items;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

router.post('/items', (req, res) => { 
    const items = req.body;
    connection((db) => {
        db.collection('items').deleteMany({});
        items.forEach(item => {
            db.collection('items')
            .insert(item)
            .catch((err) => {
                sendError(err, res);
            });
        });
    });    
});
module.exports = router;
