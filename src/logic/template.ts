import { existsSync, statSync } from "fs";
import { join } from "path";
import {
  NoPathError,
  WrongPathError,
} from "./errors";
import { IPostGenerateAction } from "./IPostGenerateAction";
import { TemplateVariable } from "./TemplateVariable";
import { PostGenerateActionFactory } from './PostGenerateActionFactory';

export enum TemplateType {
  workspace = 'workspace',
  local = 'local',
}

export class Template {
  type: TemplateType;
  templatePath: string;
  variables: Array<TemplateVariable> = [];
  actions: Array<IPostGenerateAction> = [];

  constructor(config: any, workspaceDirectory: string) {
    this.type = config.type ?? TemplateType.workspace;
    if (!config.path) {
      throw new NoPathError();
    }
    if (!existsSync(config.path) || !statSync(config.path).isDirectory()) {
      const localPath = join(workspaceDirectory, config.path);
      if (!existsSync(localPath) || !statSync(localPath).isDirectory()) {
        throw new WrongPathError(config.path);
      }
      this.templatePath = localPath;
    } else {
      this.templatePath = config.path;
    }
    
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