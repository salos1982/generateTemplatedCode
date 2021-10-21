import { existsSync, statSync } from "fs";
import { join } from "path";
import {
  NoPathError,
  WrongPathError,
} from "./errors";
import { TemplateVariable } from "./TemplateVariable";

export enum TemplateType {
  workspace = 'workspace',
  local = 'local',
}

export class Template {
  type: TemplateType;
  templatePath: string;
  variables: Array<TemplateVariable> = [];

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
    });;
  }
}