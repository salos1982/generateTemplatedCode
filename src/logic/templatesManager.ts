import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { Template, TemplateType, TemplateVariable } from "./template";
import { IUIProvider } from './IUIProvider';
import { generateModule, TemplateParameter } from "./generator";
import { NoConfigFileError, NoContextDirectoryError } from "./errors";
import { configFileName } from "./constants";
import { calculateExpression, sortCalculatedVariablesDependencies } from "./utils";
import { getPredefinedFunctions } from './expressionFunctions';


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
    let templateValues:Array<TemplateParameter> = this.getPredefinedValues(contextDirectory);
    const calculatedVariables: Array<TemplateVariable> = [];
    for (let i = 0; i < this.template.variables.length; i++) {
      const variable = this.template.variables[i];
      if (variable.inputVariable) {
        const title = `Input ${variable.name}`;
        const variableValue = await this.uiProvider.getUserText(title, variable.prompt);
        if (variableValue === undefined) {
          return;
        }

        templateValues.push({ name: variable.name, value: variableValue });
      } else {
        calculatedVariables.push(variable);
      }
    }

    if (calculatedVariables.length !== 0) {
      templateValues = this.calculateExpressions(calculatedVariables, templateValues);
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