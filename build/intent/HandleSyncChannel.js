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
const MongoDataSource_1 = require("../datasource/MongoDataSource");
const SDKDataSource_1 = require("../datasource/SDKDataSource");
class HandleSyncChannel extends sdk_1.Intent {
    execute(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let linkboxSDK = new SDKDataSource_1.SDKDataSource();
            let inputSet = args.InputSet;
            let message = args.Message;
            let channel_name = inputSet.input[0].value;
            let subject = '[Channel] - #' + channel_name;
            let content = '🤖 Here you can send and receive <b>#' + channel_name + '</b> channel messages';
            let msgData = yield linkboxSDK.sendNewMsgChannel(message.AccountAddress, content, subject);
            yield MongoDataSource_1.MongoDataSource.setChannelSync(message.AccountAddress, channel_name, [msgData.message_id]);
            let successMsgData = yield linkboxSDK.replyMsgSuccess(message, '<b>#' + channel_name + '</b> channel was added successfully 🎉');
        });
    }
}
HandleSyncChannel.Args = class HandleSyncChannelArgs {
    constructor(message, inputSet) {
        this.message = message;
        this.inputSet = inputSet;
    }
    get InputSet() {
        return this.inputSet;
    }
    get Message() {
        return this.message;
    }
};
exports.HandleSyncChannel = HandleSyncChannel;
