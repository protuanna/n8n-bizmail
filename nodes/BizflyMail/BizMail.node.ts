import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	INodePropertyOptions,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	NodeConnectionType
} from 'n8n-workflow';

export class BizMailNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'BizMail',
		name: 'bizMail',
		icon: 'file:bizmail.svg', // Optional: Add a custom icon in the nodes/ directory
		group: ['transform'],
		version: 1,
		description: 'Interact with BizMail API',
		defaults: {name: 'BizMail'},
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
					{name: 'Automation', value: 'automation'},
					{name: 'Autoresponder', value: 'autoresponder'},
					{name: 'Contact', value: 'contact'},
					{name: 'Send Mail', value: 'send_mail'},
				],
				default: 'automation',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'Automation'
						],
					},
				},
				options: [
					{
						name: 'Create Subscriber',
						value: 'create',
						action: 'Create new subscriber for automation',
						description: 'Create new subscriber for automation',
					},
					{
						name: 'Update Subscriber',
						value: 'update',
						action: 'Create new subscriber for automation',
						description: 'Create new subscriber for automation',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Automation Name or ID',
				name: 'automation_uuid',
				type: 'options',
				description: 'Choose from the list. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: {
					loadOptionsMethod: 'getListAutomation',
					loadOptionsDependsOn: ['resource'],
				},
				displayOptions: {
					show: {
						resource: ['import_automation'],
					},
				},
				default: '',
			}

			// Parameters for Send Message
			/*{
				displayName: 'Recipient',
				name: 'recipient',
				type: 'string',
				default: '',
				description: 'The recipient email or ID',
				displayOptions: {show: {resource: ['sendMessage']}},
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				default: '',
				description: 'The message content',
				displayOptions: {show: {resource: ['sendMessage']}},
			},
			// Parameters for Get User
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				description: 'The ID of the user to retrieve',
				displayOptions: {show: {resource: ['getUser']}},
			},
			// Parameters for Update User
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				description: 'The ID of the user to update',
				displayOptions: {show: {resource: ['updateUser']}},
			},
			{
				displayName: 'New Name',
				name: 'newName',
				type: 'string',
				default: '',
				description: 'The new name for the user',
				displayOptions: {show: {resource: ['updateUser']}},
			},*/
		],
	};

	methods = {
		loadOptions: {
			async getListAutomation(this: ILoadOptionsFunctions) {
				const returnData: INodePropertyOptions[] = [];
				const resource = this.getCurrentNodeParameter('resource') as string
				if (resource === 'import_automation') {
					const credentials = await this.getCredentials('bizfly-Api') // Tên này phải trùng với trong phần `credentials` đã khai báo
					// Gọi API hoặc trả về theo resource
					const method = 'GET'
					const path = '/api/customer/automation'
					const response = await this.helpers.httpRequest({
						method: method,
						url: `${credentials.baseUrl}${path}`,
						body: {
							app_key: credentials.app_key,
							project_token: credentials.project_token,
							source: 'n8n-workflow'
						},
						json: true,
					});

					if (response.success === true) {
						const data = response.data
						for (const dt of data) {
							returnData.push({
								name: dt.name,
								value: dt.uuid,
							});
						}
					}
				}

				return returnData;
			}
		}
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData()
		const returnData: INodeExecutionData[] = []
		const resource = this.getNodeParameter('resource', 0) as string
		const credentials = await this.getCredentials('bizfly-Api')
		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;
				if (resource === 'import_automation') {
					const method = 'POST'
					const path = '/api/customer/automation/import'
					const response = await this.helpers.httpRequest({
						method: method,
						url: `${credentials.baseUrl}${path}`,
						body: {
							app_key: credentials.app_key,
							project_token: credentials.project_token,
							source: 'n8n-workflow'
						},
						json: true,
					});
					// Replace with actual API call (e.g., axios.post)
					responseData = response;
				}
				// @ts-ignore
				returnData.push({json: responseData});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({json: {error: error.message}, error});
				} else {
					throw error;
				}
			}
		}

		return [returnData];
	}
}
