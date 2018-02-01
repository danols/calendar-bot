"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const Mongo = require("mongodb");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
class MongoDataSource {
    constructor() {
        this.MongoClient = Mongo.MongoClient;
    }
    init(callback) {
        this.MongoClient.connect(process.env.MONGO_URI, (err, database) => {
            if (err) {
                callback(err);
                return;
            }
            MongoDataSource.Database = database;
            callback(null);
        });
    }
    static saveUserData(email, token) {
        return new Promise((resolve, reject) => {
            var user = {
                email: email,
                token: token
            };
            MongoDataSource.Database.collection('users').insert(user, (err, result) => {
                if (err)
                    return reject(err);
                return resolve(result);
            });
        });
    }
    static getUser(email) {
        return new Promise((resolve, reject) => {
            MongoDataSource.Database.collection('users').findOne({ email: email }, (err, result) => {
                if (err)
                    return reject(err);
                return resolve(result);
            });
        });
    }
}
exports.MongoDataSource = MongoDataSource;
