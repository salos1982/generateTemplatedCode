import {
  NotInputVariableMustHaveCalculationPropertyError,
  NoVariableNameError, WrongVariableNameError
} from "./errors";

export const identifierRegEx = /^[_a-zA-Z][_a-zA-Z0-9]{0,30}$/;

export class TemplateVariable {
  name: string;
  prompt: string;
  inputVariable: boolean;
  expression?: string;

  constructor(config: any) {
    if (!config.name) {
      throw new NoVariableNameError();
    }
    if (!identifierRegEx.test(config.name)) {
      throw new WrongVariableNameError(config.name);
    }
    if (config.input !== undefined) {
      this.inputVariable = config.input;
      if (!this.inputVariable) {
        if (!config.expression) {
          throw new NotInputVariableMustHaveCalculationPropertyError();
        }
        this.expression = config.expression;
      }
    } else {
      this.inputVariable = true;
    }
    this.name = config.name;
    this.prompt = config.prompt;
  }
}
