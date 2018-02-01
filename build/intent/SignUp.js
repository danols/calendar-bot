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
const sdk_1 = require("@maildots/sdk");
const sdk_2 = require("@maildots/sdk");
const Request = require("request");
const dotenv = require("dotenv");
const SlackDataSource_1 = require("../datasource/SlackDataSource");
const MongoDataSource_1 = require("../datasource/MongoDataSource");
const SDKDataSource_1 = require("../datasource/SDKDataSource");
dotenv.config({ path: ".env" });
class SignUp extends sdk_1.Intent {
    execute(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let linkboxSDK = new SDKDataSource_1.SDKDataSource();
            let logClient = new sdk_2.LogClient();
            var references;
            let authInfo = yield this.sendAuthRequestToSlack(args.Code);
            let access_token = authInfo.access_token;
            let slackDataSource = new SlackDataSource_1.SlackDataSource(access_token);
            let channels = yield slackDataSource.getChannels();
            let team = yield slackDataSource.getTeamInfo();
            var db_channels = channels.map((channel) => {
                return {
                    id: channel.id,
                    name: team.name + '/' + channel.name,
                    team_id: authInfo.team_id,
                    accounts: []
                };
            });
            let slackUser = {
                id: authInfo.user_id,
                team_id: authInfo.team_id,
                email: args.Email,
                access_token: access_token
            };
            yield MongoDataSource_1.MongoDataSource.addSlackUser(slackUser);
            yield MongoDataSource_1.MongoDataSource.saveChannels(db_channels);
            let userdb = yield MongoDataSource_1.MongoDataSource.getUserInfo(args.Email);
            references = [userdb.message_id];
            let refMessages = yield logClient.getThread(args.Email, userdb.message_id);
            let msgData = yield linkboxSDK.sendNextSyncChannelMsg(refMessages[refMessages.length - 1], db_channels, '🔹 <b>' + authInfo.team_name + '</b> team was added successfully 🎉 <br><br> Now, choose a channel to sync', args.Email);
        });
    }
    sendAuthRequestToSlack(code) {
        return new Promise((resolve, reject) => {
            var data = {
                form: {
                    client_id: process.env.SLACK_CLIENT_ID,
                    client_secret: process.env.SLACK_CLIENT_SECRET,
                    code: code
                }
            };
            Request.post('https://slack.com/api/oauth.access', data, (err, res, result) => {
                if (err)
                    return reject(err);
                return resolve(JSON.parse(result));
            });
        });
    }
}
SignUp.Args = class SignUpArgs {
    constructor(email, code) {
        this.email = email;
        this.code = code;
    }
    get Email() {
        return this.email;
    }
    get Code() {
        return this.code;
    }
};
exports.SignUp = SignUp;
