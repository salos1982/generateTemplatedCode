import * as uuid from 'uuid';
import { processTemplateParams, TemplateParameter } from '../generator';
import { IFileManager } from '../IFileNamager';
import { IUIProvider } from '../IUIProvider';
import { IPostGenerateAction } from './IPostGenerateAction';

export class CopyRemoteFileWithSudo implements IPostGenerateAction {
  private sourceFile: string;
  private destFile: string;
  private remoteServer: string;

  constructor(config: any) {
    this.sourceFile = config.sourceFile;
    this.destFile = config.destFile;
    this.remoteServer = config.remoteServer;
  }

  async execute(currentValues: TemplateParameter[], fileManager: IFileManager, uiProvider: IUIProvider): Promise<void> {
    console.log('started CopyRemoteFileWithSudo');
    const sourceFile = processTemplateParams(this.sourceFile, currentValues).replaceAll('\\', '\\\\');
    const destFile = processTemplateParams(this.destFile, currentValues);
    const remoteServer = processTemplateParams(this.remoteServer, currentValues);
    const tmpFileName = uuid.v4();
    const uploadCommand = `scp ${sourceFile} ${remoteServer}:~/${tmpFileName}`;
    await uiProvider.runCommandInTerminal(uploadCommand);
    const moveCommand = `ssh ${remoteServer} 'sudo mv ~/${tmpFileName} ${destFile}'`;
    await uiProvider.runCommandInTerminal(moveCommand);
  }
  
}