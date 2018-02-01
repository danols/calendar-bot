import Promise = require('bluebird');
import * as Mongo from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config({ path: ".env" });

export class MongoDataSource 
{
	MongoClient;
	static Database;

	constructor()
	{
		this.MongoClient = Mongo.MongoClient;
	}

	init(callback)
	{
		this.MongoClient.connect(process.env.MONGO_URI, (err, database) => {
		  if (err) {
		  	callback(err)
		  	return
		  }
		  MongoDataSource.Database = database
			callback(null)
		})
	}

	static saveUserData(email, token): Promise<any>
	{
		return new Promise((resolve, reject) => {
			var user = {
				email: email,
				token: token
			}
			MongoDataSource.Database.collection('users').insert(user, 
			(err, result) => {
				if (err) return reject(err)
				return resolve(result)
			})
		})
	}

	static getUser(email): Promise<any>  
	{
		return new Promise((resolve, reject) => {
			MongoDataSource.Database.collection('users').findOne({email: email},
				(err, result) => {
					if (err) return reject(err)
					return resolve(result)
			})
		})
	}
}
