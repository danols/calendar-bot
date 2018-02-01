import { Intent } from "@maildots/sdk";

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as dotenv from "dotenv";

import { Util } from "../datasource/Util";

dotenv.config({ path: ".env" });

export class ContactService
{
  app;
  port;

  index;

  constructor() 
  {
    this.port = process.env.PORT || '';
    this.app = express();

    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))

    this.app.listen(this.port, (err) => this.onStartServer(err))

    this.app.get('/index', (req, res) => this.onRequestIndex(req, res));

    this.app.post('/events', (req, res) => this.onSlackEvent(req, res));
  }

  onStartServer(err)
  {
    console.log("App listening on port " + this.port);
  }

  onRequestIndex(req, res)
  {
    res.sendStatus(200).end();
  }

  async onSlackEvent(req, res)
  {
    res.sendStatus(200).end();
  }

}