import { INodeExecutionData, INodeType, INodeTypeDescription, IExecuteFunctions, NodeConnectionType } from 'n8n-workflow';

export class BizMailNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'BizMail',
		name: 'bizMail',
		icon: 'file:bizmail.svg', // Optional: Add a custom icon in the nodes/ directory
		group: ['transform'],
		version: 1,
		description: 'Interact with BizMail API',
		defaults: { name: 'BizMail' },
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'bizfly-Api',
				required: true,
			},
		],
		properties: [
			// Resource selection
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Add Subscriber to Automation', value: 'import_automation' },
					{ name: 'Add Subscriber to Autoresponder', value: 'import_autoresponder' },
					{ name: 'Add New Contact', value: 'create_contact' },
				],
				default: 'import_automation',
			},
			// Parameters for Send Message
			{
				displayName: 'Recipient',
				name: 'recipient',
				type: 'string',
				default: '',
				description: 'The recipient email or ID',
				displayOptions: { show: { resource: ['sendMessage'] } },
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				default: '',
				description: 'The message content',
				displayOptions: { show: { resource: ['sendMessage'] } },
			},
			// Parameters for Get User
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				description: 'The ID of the user to retrieve',
				displayOptions: { show: { resource: ['getUser'] } },
			},
			// Parameters for Update User
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				description: 'The ID of the user to update',
				displayOptions: { show: { resource: ['updateUser'] } },
			},
			{
				displayName: 'New Name',
				name: 'newName',
				type: 'string',
				default: '',
				description: 'The new name for the user',
				displayOptions: { show: { resource: ['updateUser'] } },
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const credentials = await this.getCredentials('myServiceApi') as { apiKey: string };

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;
				if (resource === 'sendMessage') {
					const recipient = this.getNodeParameter('recipient', i) as string;
					const message = this.getNodeParameter('message', i) as string;
					// Replace with actual API call (e.g., axios.post)
					responseData = { status: 'success', message: `Sent to ${recipient}: ${message}` };
				} else if (resource === 'getUser') {
					const userId = this.getNodeParameter('userId', i) as string;
					// Replace with actual API call (e.g., axios.get)
					responseData = { userId, name: 'John Doe', email: 'john@example.com' };
				} else if (resource === 'updateUser') {
					const userId = this.getNodeParameter('userId', i) as string;
					const newName = this.getNodeParameter('newName', i) as string;
					// Replace with actual API call (e.g., axios.put)
					responseData = { userId, updatedName: newName };
				}
				returnData.push({ json: responseData });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message }, error });
				} else {
					throw error;
				}
			}
		}

		return [returnData];
	}
}
