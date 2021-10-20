import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { Template, TemplateType } from "./template";
import { IUIProvider } from './IUIProvider';
import { generateModule } from "./generator";
import { NoConfigFileError, NoContextDirectoryError } from "./errors";
import { configFileName } from "./constants";

export class TemplatesManager {
  template: Template;
  workspaceDirectory: string;
  uiProvider: IUIProvider;

  constructor(workspaceDirectory:string, uiProvider: IUIProvider) {
    const configFilename = join(workspaceDirectory, configFileName);
    if (!existsSync(configFilename)) {
      throw new NoConfigFileError(workspaceDirectory);
    }

    const configData = readFileSync(configFilename, { encoding: 'utf-8'});
    const config = JSON.parse(configData);
    this.template = new Template(config, workspaceDirectory);
    this.workspaceDirectory = workspaceDirectory;
    this.uiProvider = uiProvider;
  }

  async applyTemplate(contextDirectory: string | null) {
    const templateValues:Array<{name: string, value: string}> = [];
    for (let i = 0; i < this.template.variables.length; i++) {
      const variable = this.template.variables[i];
      const title = `Input ${variable.name}`;
      const variableValue = await this.uiProvider.getUserText(title, variable.prompt);
      if (variableValue === undefined) {
        return;
      }

      templateValues.push({ name: variable.name, value: variableValue });
    }

    if (this.template.type === TemplateType.local) {
      if (contextDirectory) {
        generateModule(this.template.templatePath, contextDirectory, templateValues);
      } else {
        throw new NoContextDirectoryError();
      }
    } else if (this.template.type === TemplateType.workspace) {
      generateModule(this.template.templatePath, this.workspaceDirectory, templateValues);
    }
  }
}