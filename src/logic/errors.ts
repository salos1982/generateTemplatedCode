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

export class NoNameError extends Error {
  constructor() {
    super('No name for template');
  }
}

export class NoTypeError extends Error {
  constructor() {
    super('No type for template');
  }
}

export class WrongTypeError extends Error {
  constructor(value: any) {
    super(`Type for template must be either 'worspace' or 'local' found ${value}`);
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

export class WrongFileNameForSnippet extends Error {
  constructor() {
    super('Property fileName is not set for addSnippet action');
  }
}

export class WrongSnippet extends Error {
  constructor() {
    super('Property snippet is not set for addSnippet action');
  }
}

export class WrongFileNameError extends Error {
  constructor(path: string) {
    super(`Wrong path ${path}`);
  }
}

export class NoSnippetError extends Error {
  constructor(snippet: string, file: string) {
    super(`There is no snippet ${snippet} in ${file}`);
  }
}

export class WrongPositionValue extends Error {
  constructor() {
    super('Position can be only "after" or "before" values');
  }
}

export class NoActionTypeError extends Error {
  constructor() {
    super('Action must have "type" field');
  }
}