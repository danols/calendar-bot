import readline = require('readline');
import { BaseComponent } from "@maildots/sdk";
import { CalendarDataSource } from "../datasource/CalendarDataSource";
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
		let calendarClient = new CalendarDataSource();
		let url = await calendarClient.getOAuthURL()
		console.log(url)

		var rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});
		rl.question('Enter the code from that page here: ', async function(code) {
			rl.close();
			console.log(code)
			let token = await calendarClient.getTokenFromGoogle(code)
			console.log(token);

			var event = {
				summary: 'Google I/O 2018',
				location: '800 Howard St., San Francisco, CA 94103',
				description: 'A chance to hear more about Google developer products.',
				start: {
					dateTime: '2018-02-10T09:00:00-07:00',
					timeZone: 'America/Los_Angeles',
				},
				end: {
					dateTime: '2018-02-10T17:00:00-07:00',
					timeZone: 'America/Los_Angeles',
				},			
			};
			
			let eventData = await calendarClient.saveEvent(token, event)
			console.log(eventData)
			console.log()
			console.log()
			console.log()
			let events = await calendarClient.getCalenderEvents(token);
			console.log(events)
		});
		/*
		let startConversation = new StartConversation();
    let args = new StartConversation.Args(accountAddress);
		await startConversation.execute(args);
		*/
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
