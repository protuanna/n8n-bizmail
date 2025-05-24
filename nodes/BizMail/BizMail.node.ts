import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError
} from 'n8n-workflow';

export class BizMail implements INodeType {
	// @ts-ignore
	description: INodeTypeDescription = {
		displayName: 'BizMail',
		name: 'bizMail',
		icon: 'file:bizmail_icon.svg', // Optional: Add a custom icon in the nodes/ directory
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
							'automation'
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
						action: 'Update subscriber for automation',
						description: 'Update subscriber for automation',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'autoresponder'
						],
					},
				},
				options: [
					{
						name: 'Create Subscriber',
						value: 'create',
						action: 'Create new subscriber for autoresponder',
						description: 'Create new subscriber for autoresponder',
					},
					/*{
						name: 'Update Subscriber',
						value: 'update',
						action: 'Update subscriber for autoresponder',
						description: 'Update subscriber for autoresponder',
					},*/
				],
				default: 'create',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'contact'
						],
					},
				},
				options: [
					{
						name: 'Create Contact',
						value: 'create',
						action: 'Create new contact',
						description: 'Create new contact',
					}
				],
				default: 'create',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'send_mail'
						],
					},
				},
				options: [
					{
						name: 'Send Mail',
						value: 'send',
						action: 'Send a new email',
						description: 'Send a new email',
					}
				],
				default: 'send',
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
						resource: ['automation'],
					},
				},
				default: '',
			},
			{
				displayName: 'Autoresponder Name or ID',
				name: 'autoresponder_uuid',
				type: 'options',
				description: 'Choose from the list. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: {
					loadOptionsMethod: 'getListAutoresponder',
					loadOptionsDependsOn: ['resource'],
				},
				displayOptions: {
					show: {
						resource: ['autoresponder'],
					},
				},
				default: '',
			},
			{
				displayName: 'Update Conditions',
				name: 'condition',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['automation'],
						operation: ['update'],
					},
				},
				default: {},
				options: [
					{
						name: 'field',
						displayName: 'Field',
						values: [
							{
								displayName: 'Field Name or ID',
								name: 'field_name',
								type: 'options',
								description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
								typeOptions: {
									loadOptionsMethod: 'getMergeFields',
								},
								default: '',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
			{
				displayName: 'Merge Fields',
				name: 'merge_fields',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['automation', 'autoresponder', 'contact'],
					},
				},
				default: {},
				options: [
					{
						name: 'field',
						displayName: 'Field',
						values: [
							{
								displayName: 'Field Name or ID',
								name: 'field_name',
								type: 'options',
								description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
								typeOptions: {
									loadOptionsMethod: 'getMergeFields',
								},
								default: '',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
			{
				displayName: 'From Email Name or ID',
				name: 'from',
				type: 'options',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getSenders',
				},
				displayOptions: {
					show: {
						resource: ['send_mail'],
					},
				},
				default: '',
			},
			{
				displayName: 'To Email',
				name: 'to',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['send_mail'],
					},
				},
				default: '',
			},
			{
				displayName: 'Bcc Email',
				name: 'bcc',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['send_mail'],
					},
				},
				default: '',
				description: 'Multiple ones can be comma-separated',
			},
			{
				displayName: 'Cc Email',
				name: 'cc',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['send_mail'],
					},
				},
				default: '',
				description: 'Multiple ones can be comma-separated',
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['send_mail'],
					},
				},
				default: '',
			},
			{
				displayName: 'HTML Content',
				name: 'html_content',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['send_mail'],
					},
				},
				typeOptions: {
					rows: 10,
					editor: 'htmlEditor',
				},
				default: '',
				description: 'Paste HTML content',
			},
			{
				displayName: 'Attachments Link',
				name: 'attach_links',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['send_mail'],
					},
				},
				default: '',
				description: 'Multiple ones can be comma-separated',
			}
		],
	};

	methods = {
		loadOptions: {
			async getListAutomation(this: ILoadOptionsFunctions) {
				const returnData: INodePropertyOptions[] = [];
				const resource = this.getCurrentNodeParameter('resource') as string
				//const operation = this.getCurrentNodeParameter('operation') as string
				if (resource === 'automation') {
					const credentials = await this.getCredentials('bizfly-Api') // Tên này phải trùng với trong phần `credentials` đã khai báo
					// Gọi API hoặc trả về theo resource
					const method = 'GET'
					const path = '/api/customer/automation/search'
					const response = await this.helpers.httpRequest({
						method: method,
						url: `${credentials.baseUrl}${path}`,
						qs: {
							app_key: credentials.app_key,
							project_token: credentials.project_token,
							source: 'n8n-workflow',
							status: 3
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
			},
			async getListAutoresponder(this: ILoadOptionsFunctions) {
				const returnData: INodePropertyOptions[] = [];
				const resource = this.getCurrentNodeParameter('resource') as string
				//const operation = this.getCurrentNodeParameter('operation') as string
				if (resource === 'autoresponder') {
					const credentials = await this.getCredentials('bizfly-Api') // Tên này phải trùng với trong phần `credentials` đã khai báo
					// Gọi API hoặc trả về theo resource
					const method = 'GET'
					const path = '/api/customer/autoresponder/search'
					const response = await this.helpers.httpRequest({
						method: method,
						url: `${credentials.baseUrl}${path}`,
						qs: {
							app_key: credentials.app_key,
							project_token: credentials.project_token,
							source: 'n8n-workflow'
						},
						json: true,
					});
					if (response.success === true) {
						const data = response.data
						for (const dt of data) {
							if (dt.uuid) {
								returnData.push({
									name: dt.name,
									value: dt.uuid,
								});
							}
						}
					}
				}

				return returnData;
			},
			async getMergeFields(this: ILoadOptionsFunctions) {
				const returnData: INodePropertyOptions[] = [];
				const credentials = await this.getCredentials('bizfly-Api');
				const method = 'GET'
				const path = '/api/customer/field/search'
				const response = await this.helpers.httpRequest({
					method: method,
					url: `${credentials.baseUrl}${path}`, // ví dụ URL API
					qs: {
						app_key: credentials.app_key,
						project_token: credentials.project_token,
						source: 'n8n-workflow'
					},
					json: true,
				});

				if (response.success === true) {
					const data = response.data
					for (const dt of data) {
						if (!dt.parent_uuid) {
							returnData.push({
								name: dt.label,
								value: dt.key,
							});
						}
					}
				}
				return returnData
			},
			async getSenders(this: ILoadOptionsFunctions) {
				const returnData: INodePropertyOptions[] = [];
				const credentials = await this.getCredentials('bizfly-Api');
				const method = 'GET'
				const path = '/api/customer/sender/search'
				const response = await this.helpers.httpRequest({
					method: method,
					url: `${credentials.baseUrl}${path}`, // ví dụ URL API
					qs: {
						app_key: credentials.app_key,
						project_token: credentials.project_token,
						source: 'n8n-workflow'
					},
					json: true,
				});

				if (response.success === true) {
					const data = response.data
					for (const dt of data) {
						if (!dt.parent_uuid) {
							returnData.push({
								name: dt.name + ' <' + dt.email + '>',
								value: dt.name + ' <' + dt.email + '>',
							});
						}
					}
				}
				return returnData
			},
		}
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData()
		const returnData: INodeExecutionData[] = []
		const resource = this.getNodeParameter('resource', 0) as string
		const operation = this.getNodeParameter('operation', 0) as string
		const automation_uuid = this.getNodeParameter('automation_uuid', 0) as string
		const credentials = await this.getCredentials('bizfly-Api')
		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;
				const rawMergeFields = this.getNodeParameter('merge_fields', i, {}) as {
					field?: Array<{ field_name: string; value: string }>;
				};
				const mergeFields = rawMergeFields.field ?? [];
				const mergeFieldsObject = Object.fromEntries(
					mergeFields.map(f => [f.field_name, f.value])
				);

				const rawCondition = this.getNodeParameter('condition', i, {}) as {
					field?: Array<{ field_name: string; value: string }>;
				};
				const condition = rawCondition.field ?? [];
				const conditionObject = Object.fromEntries(
					condition.map(f => [`query.${f.field_name}`, f.value])
				);
				if (resource === 'automation' && operation === 'create') {
					const method = 'POST'
					const path = '/api/customer/automation/import'
					const body = {
						app_key: credentials.app_key,
						project_token: credentials.project_token,
						source: 'n8n-workflow',
						uuid: automation_uuid,
						...mergeFieldsObject,
					}
					// Replace with actual API call (e.g., axios.post)
					responseData = await this.helpers.httpRequest({
						method: method,
						url: `${credentials.baseUrl}${path}`,
						body: body,
						json: true,
					});
				}

				if (resource === 'automation' && operation === 'update') {
					const method = 'POST'
					const path = '/api/customer/automation/update'
					const body = {
						app_key: credentials.app_key,
						project_token: credentials.project_token,
						source: 'n8n-workflow',
						uuid: automation_uuid,
						...conditionObject,
						...mergeFieldsObject,
					}
					// Replace with actual API call (e.g., axios.post)
					responseData = await this.helpers.httpRequest({
						method: method,
						url: `${credentials.baseUrl}${path}`,
						body: body,
						json: true,
					});
				}

				if (resource === 'autoresponder' && operation === 'create') {
					const method = 'POST'
					const path = '/api/customer/autoresponder/import'
					const body = {
						app_key: credentials.app_key,
						project_token: credentials.project_token,
						source: 'n8n-workflow',
						uuid: automation_uuid,
						...mergeFieldsObject,
					}
					// Replace with actual API call (e.g., axios.post)
					responseData = await this.helpers.httpRequest({
						method: method,
						url: `${credentials.baseUrl}${path}`,
						body: body,
						json: true,
					});
				}

				if (resource === 'contact' && operation === 'create') {

					if (!mergeFieldsObject['emails'] || mergeFieldsObject['emails'].trim() === '') {
						const error = new NodeOperationError(this.getNode(), 'Email is required in the "Merge Fields" section.');
						if (this.continueOnFail()) {
							returnData.push({
								json: {error: error.message},
								error, // <- đúng kiểu rồi
							});
							continue;
						} else {
							throw error;
						}
					}

					const method = 'POST'
					const path = '/api/customer/contact/import'
					const body = {
						app_key: credentials.app_key,
						project_token: credentials.project_token,
						source: 'n8n-workflow',
						uuid: automation_uuid,
						...mergeFieldsObject,
					}
					// Replace with actual API call (e.g., axios.post)
					responseData = await this.helpers.httpRequest({
						method: method,
						url: `${credentials.baseUrl}${path}`,
						body: body,
						json: true,
					});
				}

				if (resource === 'send_mail' && operation === 'send') {
					const rawFrom = this.getNodeParameter('from', i) as string;
					const to = this.getNodeParameter('to', i) as string;
					const bcc = this.getNodeParameter('bcc', i, '') as string;
					const cc = this.getNodeParameter('cc', i, '') as string;
					const subject = this.getNodeParameter('subject', i) as string;
					const content = this.getNodeParameter('html_content', i) as string;
					const attach_links = this.getNodeParameter('attach_links', i, '') as string;
					let from = rawFrom;
					let from_name = '';
					const match = rawFrom.match(/^(.*)<(.*)>$/);
					if (match) {
						from_name = match[1].trim();
						from = match[2].trim();
					}

					const method = 'POST'
					const path = '/api/customer/simple-mail/send'
					const body = {
						app_key: credentials.app_key,
						project_token: credentials.project_token,
						source: 'n8n-workflow',
						uuid: automation_uuid,
						from: from,
						from_name: from_name,
						to: to,
						cc: cc,
						bcc: bcc,
						subject: subject,
						content: content,
						attach_links: attach_links
					}
					// Replace with actual API call (e.g., axios.post)
					responseData = await this.helpers.httpRequest({
						method: method,
						url: `${credentials.baseUrl}${path}`,
						body: body,
						json: true,
					});
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
