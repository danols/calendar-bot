"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Google = require("googleapis");
const GoogleAuth = require("google-auth-library");
const MongoDataSource_1 = require("./MongoDataSource");
class CalendarDataSource {
    constructor() {
        this.SCOPES = ['https://www.googleapis.com/auth/calendar'];
    }
    readAppCredentials() {
        return new Promise((resolve, reject) => {
            fs.readFile('client_secret.json', function processClientSecrets(err, appCredentials) {
                if (err)
                    return reject(err);
                return resolve(JSON.parse(appCredentials));
            });
        });
    }
    authorize(credentials) {
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
    getOAuthURL() {
        return __awaiter(this, void 0, void 0, function* () {
            let credentials = yield this.readAppCredentials();
            let oauth2Client = this.authorize(credentials);
            var authUrl = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: this.SCOPES
            });
            return authUrl;
        });
    }
    getTokenFromGoogle(code) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let credentials = yield this.readAppCredentials();
            let oauth2Client = this.authorize(credentials);
            oauth2Client.getToken(code, function (err, token) {
                if (err)
                    return reject(err);
                return resolve(token);
            });
        }));
    }
    saveToken(token, email) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield MongoDataSource_1.MongoDataSource.getUser(email);
            if (!user) {
                yield MongoDataSource_1.MongoDataSource.saveUserData(email, token);
            }
        });
    }
    getCalenderEvents(token) {
        return __awaiter(this, void 0, void 0, function* () {
            let credentials = yield this.readAppCredentials();
            let oauth2Client = this.authorize(credentials);
            oauth2Client.credentials = token;
            let eventData = yield this.listEvents(oauth2Client);
            return eventData;
        });
    }
    saveEvent(token, event) {
        return __awaiter(this, void 0, void 0, function* () {
            let credentials = yield this.readAppCredentials();
            let oauth2Client = this.authorize(credentials);
            oauth2Client.credentials = token;
            let eventData = yield this.postEvent(oauth2Client, event);
            return eventData;
        });
    }
    postEvent(auth, event) {
        return new Promise((resolve, reject) => {
            var calendar = Google.calendar('v3');
            calendar.events.insert({
                auth: auth,
                calendarId: 'primary',
                resource: event,
            }, function (err, _event) {
                if (err) {
                    return reject('There was an error contacting the Calendar service: ' + err);
                    ;
                }
                return resolve('Event created: ' + _event.htmlLink);
            });
        });
    }
    listEvents(auth) {
        return new Promise((resolve, reject) => {
            var calendar = Google.calendar('v3');
            calendar.events.list({
                auth: auth,
                calendarId: 'primary',
                timeMin: (new Date()).toISOString(),
                maxResults: 5,
                singleEvents: true,
                orderBy: 'startTime'
            }, function (err, response) {
                if (err)
                    return reject(err);
                var events = response.items;
                if (events.length == 0) {
                    return resolve('No upcoming events found.');
                }
                else {
                    let str_events = '';
                    str_events += 'Upcoming 10 events:\n';
                    for (var i = 0; i < events.length; i++) {
                        var event = events[i];
                        var start = event.start.dateTime || event.start.date;
                        str_events += (start + ' - ' + event.summary);
                    }
                    return resolve(str_events);
                }
            });
        });
    }
}
exports.CalendarDataSource = CalendarDataSource;
