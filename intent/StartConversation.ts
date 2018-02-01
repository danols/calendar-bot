import BPromise = require('bluebird');

import { Intent } from '@maildots/sdk';
import { Argument } from '@maildots/sdk';
import { Util } from "../datasource/Util";

import { SDKDataSource } from "../datasource/SDKDataSource";

export class StartConversation extends Intent<void>
{

  async execute(args: any)
  {
    let linkboxSDK = new SDKDataSource()
    let userAddress = args.UserAddress;

    let msgData = await linkboxSDK.sendWelcomeMsg
    (
      userAddress,
      Util.encrypt(userAddress)
    );
  }

  static Args = class StartConversationArgs implements Argument {

    user_address: string;
  
    constructor(user_address: string) 
    {
      this.user_address = user_address;
    }
  
    get UserAddress()
    {
      return this.user_address;
    }
  }
}
