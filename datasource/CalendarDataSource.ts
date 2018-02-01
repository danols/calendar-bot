import * as fs from 'fs';
import * as Google from 'googleapis';
import GoogleAuth = require('google-auth-library');
import { MongoDataSource } from './MongoDataSource';



export class CalendarDataSource 
{
	private SCOPES = ['https://www.googleapis.com/auth/calendar'];

	constructor() 
	{
	}

	private readAppCredentials() {
		return new Promise((resolve, reject) => {
			fs.readFile('client_secret.json', function processClientSecrets(err, appCredentials) {
				if (err) return reject(err)
				return resolve(JSON.parse(appCredentials))
			});
		})
		
	}

	private authorize(credentials) {
		var clientSecret = credentials.installed.client_secret;
		var clientId = credentials.installed.client_id;
		var redirectUrl = credentials.installed.redirect_uris[0];
		var auth = new GoogleAuth();
		var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

		return oauth2Client;
		/*
		let user = await MongoDataSource.getUser(email);
		if (!user) {
			let authUrl = this.getOAuthURL(oauth2Client);
			let token = await this.getTokenFromGoogle(oauth2Client, '')
			//oauth2Client.credentials = token;
		} else {
			let token = user.token;
			oauth2Client.credentials = JSON.parse(token);
			this.listEvents(oauth2Client);
		}
		*/
	}

	async getOAuthURL() {
		let credentials = await this.readAppCredentials();
		let oauth2Client = this.authorize(credentials);
		var authUrl = oauth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: this.SCOPES
		});

		return authUrl;
	}

	getTokenFromGoogle(code) {
		return new Promise(async (resolve, reject) => {
			let credentials = await this.readAppCredentials();
			let oauth2Client = this.authorize(credentials);
			oauth2Client.getToken(code, function(err, token) {
				if (err) return reject(err)
				return resolve(token);
			});
		})
	}

	private async saveToken(token, email) {
		let user = await MongoDataSource.getUser(email);
		if (!user) {
			await MongoDataSource.saveUserData(email, token);
		}
	}

  async getCalenderEvents(token) {
		let credentials = await this.readAppCredentials();
		let oauth2Client = this.authorize(credentials);
		oauth2Client.credentials = token;
		let eventData = await this.listEvents(oauth2Client)
		return eventData;
	}

	async saveEvent(token, event) {
		let credentials = await this.readAppCredentials();
		let oauth2Client = this.authorize(credentials);
		oauth2Client.credentials = token;
		let eventData = await this.postEvent(oauth2Client, event)
		return eventData;
	}

	private postEvent(auth, event) {
		return new Promise((resolve, reject) => {
			var calendar = Google.calendar('v3');
			calendar.events.insert({
				auth: auth,
				calendarId: 'primary',
				resource: event,
			}, function(err, _event) {
				if (err) {
					return reject('There was an error contacting the Calendar service: ' + err);
					;
				}
				return resolve('Event created: ' +  _event.htmlLink);
			});
		})
	}

	private listEvents(auth) {
		return new Promise((resolve, reject) => {
			var calendar = Google.calendar('v3');
			calendar.events.list({
				auth: auth,
				calendarId: 'primary',
				timeMin: (new Date()).toISOString(),
				maxResults: 5,
				singleEvents: true,
				orderBy: 'startTime'
			}, function(err, response) {
				if (err) return reject(err)
				var events = response.items;
				if (events.length == 0) {
					return resolve('No upcoming events found.');
				} else {
					let str_events = '';
					str_events += 'Upcoming 10 events:\n';
					for (var i = 0; i < events.length; i++) {
						var event = events[i];
						var start = event.start.dateTime || event.start.date;
						str_events += (start + ' - ' + event.summary)
					}
					return resolve(str_events);
				}
			});
		})
	}
 
}
