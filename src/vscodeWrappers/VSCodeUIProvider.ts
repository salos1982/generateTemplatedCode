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

  async runCommandInTerminal(cmd: string): Promise<boolean> {
    const terminal = this.getOrCreateTerminal();
    terminal.show(true);
		terminal.sendText(cmd);
    return true;
  }

  private readonly terminaltitle = 'Add Module';

  private getOrCreateTerminal(): vscode.Terminal {
    const terminals = <vscode.Terminal[]>(<any>vscode.window).terminals;
    if (terminals.length === 0) {
      return vscode.window.createTerminal(this.terminaltitle);
    }

    const ourTerminal = terminals.find((item) => item.name === this.terminaltitle);
    if (ourTerminal) {
      return ourTerminal;
    }

    return vscode.window.createTerminal(this.terminaltitle);
  }
}
