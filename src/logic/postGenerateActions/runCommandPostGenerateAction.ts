import { processTemplateParams, TemplateParameter } from '../generator';
import { IFileManager } from '../IFileNamager';
import { IUIProvider } from '../IUIProvider';
import { IPostGenerateAction } from './IPostGenerateAction';

export class RunCommandPostGenerateAction implements IPostGenerateAction {
  private ccommand: string;

  constructor(config: any) {
    this.ccommand = config.cmd;
  }

  async execute(currentValues: TemplateParameter[], fileManager: IFileManager, uiProvider: IUIProvider): Promise<void> {
    const command = processTemplateParams(this.ccommand, currentValues);
    await uiProvider.runCommandInTerminal(command);
  }

}