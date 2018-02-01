import * as SDK from '@maildots/sdk';
import * as dotenv from 'dotenv';

dotenv.config({ path: ".env" });

import { SDKRepository } from "../repository/SDKRepository";

export class SDKDataSource implements SDKRepository
{
  sendingClient: SDK.SendingClient;

  constructor()
  {
    this.sendingClient = new SDK.SendingClient();
  }

  sendWelcomeMsg(to_address, state): Promise<any>
	{
		return new Promise(async (resolve) => {
			let to = new SDK.Contact(to_address)
			let content = 'Hi! 🤖 '
			let msg = new SDK.Message(content).setReceivers([to]).setSubject('Contact-bot')
      
			let msgResult = await this.sendingClient.sendMessage(msg);
      return resolve(msgResult);
		})
	}

}
