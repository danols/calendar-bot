import { BaseComponent } from "@maildots/sdk";
import { Intent } from "@maildots/sdk";
import { Message } from "@maildots/sdk";
import { InputSet } from "@maildots/sdk";

import { StartConversation } from "../intent/StartConversation";

export class Index extends BaseComponent
{
  constructor()
	{
		super();
	}

	async onNewMessage(message: Message) 
	{
		console.log("ON NEW MESSAGE")
	}

	async onInstall(accountAddress: string) 
	{
		console.log("ON NEW INSTALL");
		let startConversation = new StartConversation();
    let args = new StartConversation.Args(accountAddress);
    await startConversation.execute(args);
	}

	async onUninstall(accountAddress: string)
	{
		console.log("ON NEW UNINSTALL");
	}

	async onCommand(command: string, message: Message) 
	{
		console.log("ON NEW COMMAND")
	}

	async onCall(command: string, message: Message)
	{
		console.log("ON NEW ONCALL")
	}

	async onInteraction(message: Message, inputSet: any)
	{
		console.log("ON NEW INTERACTION")
	}
}
