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
const Util_1 = require("../datasource/Util");
const SlackDataSource_1 = require("../datasource/SlackDataSource");
const MongoDataSource_1 = require("../datasource/MongoDataSource");
const SDKDataSource_1 = require("../datasource/SDKDataSource");
class SendChannelForm extends sdk_1.Intent {
    execute(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let linkboxSDK = new SDKDataSource_1.SDKDataSource();
            let user = yield MongoDataSource_1.MongoDataSource.getUserInfo(args.Message.AccountAddress);
            if (user.teams.length == 0) {
                let msgData = linkboxSDK.sendSyncAccountMsg(args.Message, Util_1.Util.encrypt(args.Message.AccountAddress));
            }
            else {
                BPromise.map(user.teams, (team) => __awaiter(this, void 0, void 0, function* () {
                    let slackDataSource = new SlackDataSource_1.SlackDataSource(team.access_token);
                    let channels = yield slackDataSource.getChannels();
                    let teamInfo = yield slackDataSource.getTeamInfo();
                    return {
                        team: teamInfo.name,
                        channels: channels
                    };
                })).then((channels) => {
                    let msgData = linkboxSDK.sendSyncChannelMsg(args.Message, [].concat(...channels));
                });
            }
        });
    }
}
SendChannelForm.Args = class SendChannelFormArgs {
    constructor(message) {
        this.message = message;
    }
    get Message() {
        return this.message;
    }
};
exports.SendChannelForm = SendChannelForm;
