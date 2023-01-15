import { processTemplateParams, TemplateParameter } from '../generator';
import { IFileManager } from '../IFileNamager';
import { IUIProvider } from '../IUIProvider';
import { IPostGenerateAction } from './IPostGenerateAction';

export class RunCommandPostGenerateAction implements IPostGenerateAction {
  private command: string;

  constructor(config: any) {
    this.command = config.cmd;
  }

  async execute(currentValues: TemplateParameter[], fileManager: IFileManager, uiProvider: IUIProvider): Promise<void> {
    const command = processTemplateParams(this.command, currentValues);
    await uiProvider.runCommandInTerminal(command);
  }

  check() {}
}