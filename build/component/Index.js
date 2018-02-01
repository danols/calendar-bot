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
const StartConversation_1 = require("../intent/StartConversation");
class Index extends sdk_1.BaseComponent {
    constructor() {
        super();
    }
    onNewMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("ON NEW MESSAGE");
        });
    }
    onInstall(accountAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("ON NEW INSTALL");
            let startConversation = new StartConversation_1.StartConversation();
            let args = new StartConversation_1.StartConversation.Args(accountAddress);
            yield startConversation.execute(args);
        });
    }
    onUninstall(accountAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("ON NEW UNINSTALL");
        });
    }
    onCommand(command, message) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("ON NEW COMMAND");
        });
    }
    onCall(command, message) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("ON NEW ONCALL");
        });
    }
    onInteraction(message, inputSet) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("ON NEW INTERACTION");
        });
    }
}
exports.Index = Index;
