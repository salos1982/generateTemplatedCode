import { NoActionTypeError } from '../errors';
import { IPostGenerateAction } from './IPostGenerateAction';
import { InsertTemplateToFileAction } from './insertTemplateToFileAction';
import { IUIProvider } from '../IUIProvider';
import { IFileManager } from '../IFileNamager';
import { RunCommandPostGenerateAction } from './runCommandPostGenerateAction';

export class PostGenerateActionFactory {
  static generateFromConfig(config: any): IPostGenerateAction | null {
    if (!config.type) {
      throw new NoActionTypeError();
    }

    switch(config.type) {
      case 'insertTemplateToFile': return new InsertTemplateToFileAction(config);
      case 'runCommand': return new RunCommandPostGenerateAction(config);
    }

    return null;
  }
}