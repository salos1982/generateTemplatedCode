import {  statSync } from 'fs';
import {
  NoNameError,
  NoPathError,
  NoTypeError,
  WrongPathError,
  WrongTypeError,
} from './errors';
import { IPostGenerateAction } from './postGenerateActions/IPostGenerateAction';
import { TemplateVariable } from './TemplateVariable';
import { PostGenerateActionFactory } from './postGenerateActions/PostGenerateActionFactory';
import { tryToGetFullPath } from './utils';

export enum TemplateType {
  workspace = 'workspace',
  local = 'local',
}

export class Template {
  name: string;
  type: TemplateType;
  templatePath: string;
  variables: Array<TemplateVariable> = [];
  actions: Array<IPostGenerateAction> = [];

  constructor(config: any, baseDirectory: string) {
    if (!config.type) {
      throw new NoTypeError();
    }
    if (config.type !== TemplateType.local && config.type !== TemplateType.workspace) {
      throw new WrongTypeError(config.type);
    }

    this.type = config.type;
    if (!config.path) {
      throw new NoPathError();
    }
    if (!config.name) {
      throw new NoNameError();
    }
    this.name = config.name;

    const fullPath = tryToGetFullPath(config.path, baseDirectory);
    if (!fullPath ||  !statSync(fullPath).isDirectory()) {
      throw new WrongPathError(config.path);
    }

    this.templatePath = fullPath;
    
    (config.variables ?? []).forEach((element: any) => {
      this.variables.push(new TemplateVariable(element));
    });

    (config.actions ?? []).forEach((element: any) => {
      const action = PostGenerateActionFactory.generateFromConfig(element);
      if (action) {
        this.actions.push(action);
      }
    });
  }
}