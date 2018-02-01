"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const SlackClient = require("@slack/client");
class SlackDataSource {
    constructor(slackToken) {
        let WebClient = SlackClient.WebClient;
        this.slack = new WebClient(slackToken);
    }
    sendMessage(channelId, content) {
        return new Promise((resolve, reject) => {
            this.slack.chat.postMessage(channelId, content, true, function (err, msgData) {
                if (err)
                    return reject(err);
                return resolve(msgData);
            });
        });
    }
    getTeamInfo() {
        return new Promise((resolve, reject) => {
            this.slack.team.info(function (err, teamInfo) {
                if (err)
                    return reject(err);
                return resolve(teamInfo.team);
            });
        });
    }
    getChannels() {
        return new Promise((resolve, reject) => {
            this.slack.channels.list(function (err, res) {
                if (err)
                    return reject(err);
                return resolve(res.channels);
            });
        });
    }
    getTeamUsers() {
        return new Promise((resolve, reject) => {
            this.slack.users.list(function (err, users) {
                if (err)
                    return reject(err);
                return resolve(users);
            });
        });
    }
    getUserInfo(id) {
        return new Promise((resolve, reject) => {
            this.slack.users.info(id, function (err, user) {
                if (err)
                    return reject(err);
                return resolve(user.user);
            });
        });
    }
}
exports.SlackDataSource = SlackDataSource;
