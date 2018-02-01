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
const Util_1 = require("../datasource/Util");
const SDKDataSource_1 = require("../datasource/SDKDataSource");
class StartConversation extends sdk_1.Intent {
    execute(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let linkboxSDK = new SDKDataSource_1.SDKDataSource();
            let userAddress = args.UserAddress;
            let msgData = yield linkboxSDK.sendWelcomeMsg(userAddress, Util_1.Util.encrypt(userAddress));
        });
    }
}
StartConversation.Args = class StartConversationArgs {
    constructor(user_address) {
        this.user_address = user_address;
    }
    get UserAddress() {
        return this.user_address;
    }
};
exports.StartConversation = StartConversation;
