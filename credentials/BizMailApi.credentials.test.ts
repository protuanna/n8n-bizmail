import {ICredentialTestFunctions, INodeCredentialTestResult} from 'n8n-workflow';
// @ts-ignore
import {OptionsWithUri} from 'request';

export async function testCredentials(
	this: ICredentialTestFunctions,
	credentials: {
		app_key: string;
		project_token: string;
		//api_secret: string;
		baseUrl: string;
	}
): Promise<INodeCredentialTestResult> {
	try {
		const method = 'POST';
		const path = '/api/customer/check-auth';
		const options: OptionsWithUri = {
			method,
			uri: `${credentials.baseUrl}${path}`,
			body: {
				app_key: credentials.app_key,
				project_token: credentials.project_token,
				source: 'n8n-workflow'
			},
			json: true,
		};

		await this.helpers.request(options);

		return {
			status: 'OK',
			message: 'Connection successful!',
		};
	} catch (error) {
		return {
			status: 'Error',
			message: `Connection failed: ${(error as Error).message}`,
		};
	}
}
