import { TemplateParameter } from '../generator';
import { IFileManager } from '../IFileNamager';
import { IUIProvider } from '../IUIProvider';
import { IPostGenerateAction } from './IPostGenerateAction';

export class NpmInstallAction implements IPostGenerateAction {
  private package: string;
  private version?: string;
  private dev?: boolean;

  constructor(config: any) {
    this.package = config.package;
    this.version = config.version;
    this.dev = config.dev;
  }

  async execute(currentValues: TemplateParameter[], fileManager: IFileManager, uiProvider: IUIProvider): Promise<void> {
    const command = `npm install ${this.package}` + (this.version ? `@${this.version}` : '') + (this.dev ? ' --save-dev' : ''); 
    await uiProvider.runCommandInTerminal(command);
  }
  
}