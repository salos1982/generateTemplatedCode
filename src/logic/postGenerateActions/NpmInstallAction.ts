import { TemplateParameter } from '../generator';
import { IFileManager } from '../IFileNamager';
import { IUIProvider } from '../IUIProvider';
import { IPostGenerateAction } from './IPostGenerateAction';

export class NpmInstallAction implements IPostGenerateAction {
  private packages: string;
  private dev?: boolean;

  constructor(config: any) {
    this.packages = config.packages;
    this.dev = config.dev;
  }

  async execute(currentValues: TemplateParameter[], fileManager: IFileManager, uiProvider: IUIProvider): Promise<void> {
    const command = `npm install ${this.packages}` + (this.dev ? ' --save-dev' : ''); 
    await uiProvider.runCommandInTerminal(command);
  }
  
  check() {}
}