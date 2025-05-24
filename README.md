# n8n-nodes-bizmail

This is a custom [n8n](https://n8n.io) node that integrates with [Bizfly Mail](https://bizfly.vn/giai-phap/bizfly-email.html), enabling you to send emails, manage automations, and handle contacts directly within your n8n workflows.

---

## Features

- **Send Mail**: Dispatch emails using Bizfly Mail's API.
- **Automation**: Trigger and manage email automation workflows.
- **Contact Management**: Add or update contacts in your Bizfly Mail lists.

---

## Prerequisites

Before using this node, ensure you have:

- An active [Bizfly Mail](https://bizfly.vn/giai-phap/bizfly-email.html) account.
- Your `app_key` and `project_token` from Bizfly Mail.
- [n8n](https://n8n.io) installed (version 0.200.0 or higher is recommended).

---

## Installation

### Via npm

To install the node globally:

```bash
npm install -g n8n-nodes-bizmail
```

To install the node locally within your n8n project:

```bash
npm install n8n-nodes-bizmail
```

### Linking for Development

If you're developing or modifying the node:

```bash
git clone https://github.com/protuanna/n8n-nodes-bizmail.git
cd n8n-nodes-bizmail
npm install
npm run build
npm link
```

Then, in your n8n installation directory:

```bash
npm link n8n-nodes-bizmail
```

Restart n8n to apply the changes.

---

## Usage

### Credentials Setup

Before using the node, set up your Bizfly Mail credentials in n8n:

1. Go to **Credentials** in n8n.
2. Click **New Credential** and select **Bizfly Mail API**.
3. Enter your `app_key`, `project_token`, and `baseUrl`.
4. Save the credentials.

### Node Parameters

- **From Email Name or ID**: Enter in the format `Name <email@example.com>`.
- **To Email**: Recipient's email address.
- **Bcc Email**: Blind carbon copy recipients (comma-separated).
- **Cc Email**: Carbon copy recipients (comma-separated).
- **Title**: Email subject.
- **HTML Content**: Body of the email in HTML.
- **Attachments Link**: URLs to attachments (comma-separated).

---

## Development

To contribute or modify the node:

1. Fork the repository.
2. Create a new branch for your changes.
3. Make changes and ensure code quality:

```bash
npm run lint
```

4. Build the project:

```bash
npm run build
```

5. Test your changes within n8n.
6. Submit a pull request with a clear description.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments

This node is based on the [n8n-nodes-starter](https://github.com/n8n-io/n8n-nodes-starter) template by the n8n community.
