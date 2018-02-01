import Promise = require('bluebird');
import * as FullContact from 'fullcontact';

export class ContactDataSource 
{

	private fullContactClient;

	constructor() 
	{
		this.fullContactClient = new FullContact('91bb99fc1d323278');
	}

	getContactInfo(email: string)
	{
		return new Promise((resolve, reject) => {
			this.fullContactClient.person.email(email, function (err, info) {
				if(err) {
					return resolve({found: false, info: 'Contact info not found'});
				} else {
					let contactInfo = {}
					if (info.status == 200) {
						if (info.contactInfo) {
							contactInfo['name'] = info.contactInfo.fullName;
						}
						if (info.demographics) {
							contactInfo['location'] = info.demographics.locationGeneral;
						}
						if (info.socialProfiles) {
							contactInfo['social_profiles'] = []
							info.socialProfiles.forEach((index) => {
								contactInfo['social_profiles'].push({
									name: index.typeName,
									username: (index.username ? index.username : "no-username"),
									url: index.url
								})
							})
						}
						if (info.organizations) {
							contactInfo['organizations'] = []
							info.organizations.forEach((index) => {
								contactInfo['organizations'].push({
									title: (index.title ? index.title : "no-title"),
									name: index.name
								})
							})
						}
						return resolve({found: true, info: contactInfo})
					} else {
						return resolve({found: false, info: 'Contact info not found'});
					}
				}
			})
		})
	}
}
