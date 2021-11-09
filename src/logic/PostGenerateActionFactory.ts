import { NoActionTypeError } from './errors';
import { IPostGenerateAction } from './IPostGenerateAction';
import { InsertTemplateToFileAction } from './insertTemplateToFileAction';

export class PostGenerateActionFactory {
  static generateFromConfig(config: any): IPostGenerateAction | null {
    if (!config.type) {
      throw new NoActionTypeError();
    }

    switch(config.type) {
      case 'insertTemplateToFile': return new InsertTemplateToFileAction(config);
    }

    return null;
  }
}