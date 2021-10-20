import { existsSync, statSync } from "fs";
import { join } from "path";
import { NoPathError, NotInputVariableMustHaveCalculationPropertyError, NoVariableNameError, WrongPathError } from "./errors";

export enum TemplateType {
  workspace = 'workspace',
  local = 'local',
}

export class TemplateVariable {
  name: string;
  prompt: string;
  inputVariable: boolean;

  constructor(config: any) {
    if (!config.name) {
      throw new NoVariableNameError();
    }
    if (config.input !== undefined) {
      this.inputVariable = config.input;
      if (!this.inputVariable) {
        if (!config.calculate) {
          throw new NotInputVariableMustHaveCalculationPropertyError();
        }
      }
    } else {
      this.inputVariable = true;
    }
    this.name = config.name;
    this.prompt = config.prompt;
  }
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