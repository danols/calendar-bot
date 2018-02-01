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
const SlackDataSource_1 = require("../datasource/SlackDataSource");
const MongoDataSource_1 = require("../datasource/MongoDataSource");
class SendMessageToSlackChannel extends sdk_1.Intent {
    execute(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let subject = args.Message.Subject;
            let channel = subject.substring(subject.indexOf('#') + 1, subject.length);
            let email = args.Message.From.UserAddress;
            let content = args.Message.Content;
            let references = args.Message.References;
            let channelData = yield MongoDataSource_1.MongoDataSource.getChannel(channel);
            let user = yield MongoDataSource_1.MongoDataSource.getUserInfo(email);
            var accessToken = '';
            user.teams.forEach((team) => {
                if (team.team_id == channelData.team_id) {
                    accessToken = team.access_token;
                    return;
                }
            });
            let slackDataSource = new SlackDataSource_1.SlackDataSource(accessToken);
            yield slackDataSource.sendMessage(channelData.id, content);
            yield MongoDataSource_1.MongoDataSource.setChannelReferences(email, channel, references);
        });
    }
}
SendMessageToSlackChannel.Args = class SendMessageToSlackChannelArgs {
    constructor(message) {
        this.message = message;
    }
    get Message() {
        return this.message;
    }
};
exports.SendMessageToSlackChannel = SendMessageToSlackChannel;
