import * as vscode from 'vscode';
import { IUIProvider } from '../logic/IUIProvider';

export class VSCodeUIProvider implements IUIProvider {
  async getUserText(title: string, prompt: string): Promise<string|undefined> {
    const resultText = await vscode.window.showInputBox({
      title,
      prompt,
    });

    return resultText;
  }
  
}
