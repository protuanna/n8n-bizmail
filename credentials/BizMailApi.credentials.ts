import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BizMailApi implements ICredentialType {
	name = 'bizfly-Api';
	displayName = 'Bizfly API';
	documentationUrl = 'https://help.bizfly.vn/tuy-chon-cai-dat-api-sdk-n645.html';
	properties: INodeProperties[] = [
		{
			displayName: 'Token',
			name: 'token',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			}
		},
		{
			displayName: 'Domain',
			name: 'domain',
			type: 'string',
			default: 'https://apicampaign.bizfly.vn',
		},
	];

	// This allows the credential to be used by other parts of n8n
	// stating how this credential is injected as part of the request
	// An example is the Http Request node that can make generic calls
	// reusing this credential
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{"Bearer " + $credentials.token}}',
			},
		},
	};

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			method: 'POST',
			baseURL: '={{$credentials?.domain}}',
			url: '/check-auth',
		},
	};
}
