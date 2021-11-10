import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { Template, TemplateType } from "./template";
import { TemplateVariable } from "./TemplateVariable";
import { IUIProvider } from './IUIProvider';
import { generateModule, TemplateParameter } from "./generator";
import { NoConfigFileError, NoContextDirectoryError } from "./errors";
import { configFileName } from "./constants";
import { calculateExpression, sortCalculatedVariablesDependencies } from "./utils";
import { getPredefinedFunctions } from './expressionFunctions';
import { IFileManager } from './IFileNamager';

export class TemplatesManager {
  template: Template;
  workspaceDirectory: string;
  uiProvider: IUIProvider;
  fileManager: IFileManager;

  constructor(workspaceDirectory:string, uiProvider: IUIProvider, fileManager: IFileManager) {
    const configFilename = join(workspaceDirectory, configFileName);
    if (!existsSync(configFilename)) {
      throw new NoConfigFileError(workspaceDirectory);
    }

    const configData = readFileSync(configFilename, { encoding: 'utf-8'});
    const config = JSON.parse(configData);
    this.template = new Template(config, workspaceDirectory);
    this.workspaceDirectory = workspaceDirectory;
    this.uiProvider = uiProvider;
    this.fileManager = fileManager;
  }

  async applyTemplate(template: Template, contextDirectory: string | null): Promise<boolean> {
    let templateValues:Array<TemplateParameter> = this.getPredefinedValues(contextDirectory);
    const calculatedVariables: Array<TemplateVariable> = [];
    for (let i = 0; i < template.variables.length; i++) {
      const variable = template.variables[i];
      if (variable.inputVariable) {
        const title = `Input ${variable.name}`;
        const variableValue = await this.uiProvider.getUserText(title, variable.prompt);
        if (variableValue === undefined) {
          return false;
        }

        templateValues.push({ name: variable.name, value: variableValue });
      } else {
        calculatedVariables.push(variable);
      }
    }

    if (calculatedVariables.length !== 0) {
      templateValues = this.calculateExpressions(calculatedVariables, templateValues);
    }

    if (template.type === TemplateType.local) {
      if (contextDirectory) {
        generateModule(template.templatePath, contextDirectory, templateValues);
      } else {
        throw new NoContextDirectoryError();
      }
    } else if (template.type === TemplateType.workspace) {
      generateModule(template.templatePath, this.workspaceDirectory, templateValues);
    }

    template.actions.forEach(action => {
      action.execute(templateValues, this.fileManager);
    });

    return true;
  }

  getPredefinedValues(contextDirectory: string | null): Array<TemplateParameter> {
    const result = new Array<TemplateParameter>();
    result.push({ name: 'workspace_directory', value: this.workspaceDirectory });
    if (contextDirectory !== null) {
      result.push({ name: 'context_directory', value: contextDirectory });
    }

    return result;
  }

  calculateExpressions(
    variables:Array<TemplateVariable>,
    currentValues: Array<TemplateParameter>
  ): Array<TemplateParameter> {
    const resultValues = [...currentValues];
    const sortedVariables = sortCalculatedVariablesDependencies(variables);
    const predefinedFunctions = getPredefinedFunctions(this.workspaceDirectory);
    sortedVariables.forEach(variable => {
      const variableValue = calculateExpression(predefinedFunctions, resultValues, variable.expression!);
      resultValues.push({ name: variable.name, value: variableValue });
    });

    return resultValues;
  }
}