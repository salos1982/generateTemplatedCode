import { TemplateParameter } from '../generator';
import { IFileManager } from '../IFileNamager';
import { IUIProvider } from '../IUIProvider';
import { IPostGenerateAction } from './IPostGenerateAction';

export class NpmInstallAction implements IPostGenerateAction {
  private package: string;
  private version?: string;

  constructor(config: any) {
    this.package = config.package;
    this.version = config.version;
  }

  async execute(currentValues: TemplateParameter[], fileManager: IFileManager, uiProvider: IUIProvider): Promise<void> {
    const command = `npm install ${this.package}` + (this.version ?? ''); 
    await uiProvider.runCommandInTerminal(command);
  }
  
}