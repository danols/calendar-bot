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
const BPromise = require("bluebird");
const sdk_1 = require("@maildots/sdk");
const SlackDataSource_1 = require("../datasource/SlackDataSource");
const MongoDataSource_1 = require("../datasource/MongoDataSource");
const SDKDataSource_1 = require("../datasource/SDKDataSource");
class NotifyMessage extends sdk_1.Intent {
    constructor() {
        super();
    }
    execute(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let linkboxSDK = new SDKDataSource_1.SDKDataSource();
            let data = args.EventData;
            let channel = yield MongoDataSource_1.MongoDataSource.getChannelFromId(data.channel);
            BPromise.map(channel.accounts, (account) => __awaiter(this, void 0, void 0, function* () {
                let user = yield MongoDataSource_1.MongoDataSource.getUserInfo(account.subscriber);
                var accessToken = '';
                var userId = 0;
                user.teams.forEach((team) => {
                    if (channel.team_id == team.team_id) {
                        accessToken = team.access_token;
                        userId = team.id;
                        return;
                    }
                });
                let slackDataSource = new SlackDataSource_1.SlackDataSource(accessToken);
                let from = yield slackDataSource.getUserInfo(data.user);
                if (userId != data.user)
                    return linkboxSDK.sendMessageFromSlack(account.subscriber, from.profile.display_name, data.text, channel.name, account.references);
                return { sent: false };
            })).then((msgData) => { });
        });
    }
}
NotifyMessage.Args = class NotifyMessageArgs {
    constructor(eventData) {
        this.eventData = eventData;
    }
    get EventData() {
        return this.eventData;
    }
};
exports.NotifyMessage = NotifyMessage;
