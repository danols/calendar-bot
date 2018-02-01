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
dotenv.config({ path: ".env" });
class ContactService {
    constructor() {
        this.port = process.env.PORT || '';
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.listen(this.port, (err) => this.onStartServer(err));
        this.app.get('/index', (req, res) => this.onRequestIndex(req, res));
        this.app.post('/events', (req, res) => this.onSlackEvent(req, res));
    }
    onStartServer(err) {
        console.log("App listening on port " + this.port);
    }
    onRequestIndex(req, res) {
        res.sendStatus(200).end();
    }
    onSlackEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.sendStatus(200).end();
        });
    }
}
exports.ContactService = ContactService;
