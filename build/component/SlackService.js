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
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const Util_1 = require("../datasource/Util");
const SignUp_1 = require("../intent/SignUp");
const NotifyMessage_1 = require("../intent/NotifyMessage");
dotenv.config({ path: ".env" });
class SlackService {
    constructor() {
        this.port = process.env.PORT || '';
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.listen(this.port, (err) => this.onStartServer(err));
        this.app.get('/index', (req, res) => this.onRequestIndex(req, res));
        //Github
        this.app.post('/slack/events', (req, res) => this.onSlackEvent(req, res));
        this.app.get('/slack/auth', (req, res) => this.onSlackAuth(req, res));
    }
    onStartServer(err) {
        console.log("App listening on port " + this.port);
    }
    onRequestIndex(req, res) {
        res.sendStatus(200).end();
    }
    onSlackEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.token == process.env.SLACK_VERIFICATION_TOKEN) {
                if (req.body.type == 'url_verification')
                    res.status(200).json({ 'challenge': req.body.challenge }).end();
                if (req.body.type == 'event_callback' && !req.body.event.subtype) {
                    res.sendStatus(200).end();
                    let notifyMessage = new NotifyMessage_1.NotifyMessage();
                    let args = new NotifyMessage_1.NotifyMessage.Args(req.body.event);
                    yield notifyMessage.execute(args);
                }
            }
            else {
                res.sendStatus(403).end();
            }
        });
    }
    onSlackAuth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.sendStatus(200).end();
            let email = Util_1.Util.decrypt(req.query.state);
            let code = req.query.code;
            let signUp = new SignUp_1.SignUp();
            let args = new SignUp_1.SignUp.Args(email, code);
            yield signUp.execute(args);
        });
    }
}
exports.SlackService = SlackService;
