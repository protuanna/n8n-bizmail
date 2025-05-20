import {ICredentialTestFunctions, INodeCredentialTestResult} from 'n8n-workflow';
import crypto from 'crypto';
// @ts-ignore
import {OptionsWithUri} from 'request';

export async function testCredentials(
	this: ICredentialTestFunctions,
	credentials: {
		app_key: string;
		project_token: string;
		api_secret: string;
		baseUrl: string;
	}
): Promise<INodeCredentialTestResult> {
	try {
		const method = 'GET';
		const path = '/check-auth';
		const mergeStr = '|';

		const rawString = mergeStr + [method, path, credentials.app_key].join(mergeStr) + mergeStr;
		const signature = crypto
			.createHmac('sha512', credentials.api_secret)
			.update(rawString)
			.digest('hex');

		const options: OptionsWithUri = {
			method,
			uri: `${credentials.baseUrl}${path}`,
			body: {
				app_key: credentials.app_key,
				project_token: credentials.project_token,
				signature: signature,
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
