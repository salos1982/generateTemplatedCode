// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getEndOfLineValue, getWorkspaceDirectory } from './vscodeWrappers/vsCodeTools';
import { TemplatesManager } from './logic/templatesManager';
import { VSCodeUIProvider } from './vscodeWrappers/vsCodeUIProvider';
import { VSFileManager } from './vscodeWrappers/vsFileManager';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('salos.module.generator', async (uri:vscode.Uri): Promise<void> => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const workspacePath = getWorkspaceDirectory();
		if(workspacePath) {
			try {
				const templateManager = new TemplatesManager(
					workspacePath,
					new VSCodeUIProvider(),
					new VSFileManager(getEndOfLineValue()),
				);
				const contextPath = uri ? uri!.fsPath : null;

				if (templateManager.templates.length === 1) {
					if (await templateManager.applyTemplate(templateManager.templates[0], contextPath)) {
						showSuccessNotification();
					}
				} else if (templateManager.templates.length > 1) {
					const selectedValue = await vscode.window.showQuickPick(
						templateManager.templates.map(item => item.name),
						{ canPickMany: false }
					);

					if (selectedValue) {
						const template = templateManager.templates.find(item => item.name === selectedValue);
						if (template) {
							if (await templateManager.applyTemplate(template, contextPath)) {
								showSuccessNotification();
							}
						}
					}
				}
			} catch (err: any) {
				vscode.window.showErrorMessage(err.message);
			}
		} 
		else {
				const message = "Working folder not found, open a folder an try again" ;
		
				vscode.window.showErrorMessage(message);
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function showSuccessNotification() {
	vscode.window.showInformationMessage('Template applied');
}