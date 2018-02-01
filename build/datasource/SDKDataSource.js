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
const SDK = require("@maildots/sdk");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
class SDKDataSource {
    constructor() {
        this.sendingClient = new SDK.SendingClient();
    }
    sendWelcomeMsg(to_address, state) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let to = new SDK.Contact(to_address);
            let content = 'Hi! 🤖 ';
            let msg = new SDK.Message(content).setReceivers([to]).setSubject('Contact-bot');
            let msgResult = yield this.sendingClient.sendMessage(msg);
            return resolve(msgResult);
        }));
    }
}
exports.SDKDataSource = SDKDataSource;
