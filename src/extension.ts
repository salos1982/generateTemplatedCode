// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getWorkspaceDirectory } from './vscodeWrappers/vsCodeTools';
import { TemplatesManager } from './logic/templatesManager';
import { VSCodeUIProvider } from './vscodeWrappers/VSCodeUIProvider';
import { FileManager } from './logic/fileManager';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "addmodule" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('salos.addModule', async (uri:vscode.Uri): Promise<void> => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const workspacePath = getWorkspaceDirectory();
		if(workspacePath) {
			try {
				const templateManager = new TemplatesManager(workspacePath, new VSCodeUIProvider(), new FileManager('\n'));
				const contextPath = uri ? uri!.fsPath : null;
				await templateManager.applyTemplate(templateManager.template, contextPath);
				vscode.window.showInformationMessage('Template applied');
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
