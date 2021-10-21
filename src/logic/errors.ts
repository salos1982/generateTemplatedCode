import { configFileName } from './constants';

export class WrongPathError extends Error {
  constructor(path: string) {
    super(`Wrong path for template directory '${path}'`);
  }
}

export class NoPathError extends Error {
  constructor() {
    super('No path for template');
  }
}

export class NoVariableNameError extends Error {
  constructor() {
    super('Variable must have name');
  }
}

export class WrongVariableNameError extends Error {
  constructor(name:string) {
    super(`Variable name "${name}" must be identifier (no spaces etc)`);
  }
}

export class NoConfigFileError extends Error {
  constructor(workspaceDirectory: string) {
    super(`Config found "${configFileName}}" is not found in workspace directory ${workspaceDirectory}`);
  }
}

export class NoContextDirectoryError extends Error {
  constructor() {
    super('No context directory for template');
  }
}

export class NotInputVariableMustHaveCalculationPropertyError extends Error {
  constructor() {
    super('Variable can be either input or calculated.\
If variable is set as not input it must contain field calculate with function that calculate value');
  }
}

export class CycleDependencyError extends Error {
  constructor(variables: Array<string>) {
    super(`Variables ${variables} have cycle dependency`);
  }
}

export class WrongRelativePathError extends Error {
  constructor(path: string, basePath: string) {
    super(`Path ${path} is not relative to ${basePath}`);
  }
}