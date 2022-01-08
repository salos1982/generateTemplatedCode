import { NoActionTypeError } from '../errors';
import { IPostGenerateAction } from './IPostGenerateAction';
import { InsertTemplateToFileAction } from './insertTemplateToFileAction';
import { RunCommandPostGenerateAction } from './runCommandPostGenerateAction';
import { NpmInstallAction } from './NpmInstallAction';

export class PostGenerateActionFactory {
  static generateFromConfig(config: any): IPostGenerateAction | null {
    if (!config.type) {
      throw new NoActionTypeError();
    }

    switch(config.type) {
      case 'insertTemplateToFile': return new InsertTemplateToFileAction(config);
      case 'runCommand': return new RunCommandPostGenerateAction(config);
      case 'npmInstall': return new NpmInstallAction(config);
    }

    return null;
  }
}