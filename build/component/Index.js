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
const readline = require("readline");
const sdk_1 = require("@maildots/sdk");
const CalendarDataSource_1 = require("../datasource/CalendarDataSource");
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
            let calendarClient = new CalendarDataSource_1.CalendarDataSource();
            let url = yield calendarClient.getOAuthURL();
            console.log(url);
            var rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question('Enter the code from that page here: ', function (code) {
                return __awaiter(this, void 0, void 0, function* () {
                    rl.close();
                    console.log(code);
                    let token = yield calendarClient.getTokenFromGoogle(code);
                    console.log(token);
                    var event = {
                        'summary': 'Google I/O 2018',
                        'location': '800 Howard St., San Francisco, CA 94103',
                        'description': 'A chance to hear more about Google\'s developer products.',
                        'start': {
                            'dateTime': '2018-02-10T09:00:00-07:00',
                            'timeZone': 'America/Los_Angeles',
                        },
                        'end': {
                            'dateTime': '2018-02-10T17:00:00-07:00',
                            'timeZone': 'America/Los_Angeles',
                        },
                        'reminders': {
                            'useDefault': false,
                            'overrides': [
                                { 'method': 'email', 'minutes': 24 * 60 },
                                { 'method': 'popup', 'minutes': 10 },
                            ],
                        },
                    };
                    let eventData = yield calendarClient.saveEvent(token, event);
                    console.log(eventData);
                    console.log();
                    console.log();
                    console.log();
                    let events = yield calendarClient.getCalenderEvents(token);
                    console.log(events);
                });
            });
            /*
            let startConversation = new StartConversation();
        let args = new StartConversation.Args(accountAddress);
            await startConversation.execute(args);
            */
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
