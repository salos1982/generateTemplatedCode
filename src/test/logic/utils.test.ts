import { tmpdir } from 'os';

import { getPredefinedFunctions } from '../../logic/expressionFunctions';
import { TemplateVariable } from "../../logic/TemplateVariable";
import { variableDependsOn, sortCalculatedVariablesDependencies } from '../../logic/utils';
import { CycleDependencyError } from './../../logic/errors';
import { join } from 'path';
import { calculateExpression } from './../../logic/utils';


describe('test variable dependencies', () => {
	it('simple dependency', () => {
    const variable1 = new TemplateVariable({
      name: 'var1',
      input: false,
      expression: 'cammelCase(var2)',
    });
    const variable2 = new TemplateVariable({
      name: 'var2',
    });
		expect(variableDependsOn(variable1, variable2)).toBe(true);
	});

  it('similar name no dependency', () => {
    const variable1 = new TemplateVariable({
      name: 'var1',
      intput: false,
      expression: 'cammelCase(var2)',
    });
    const variable2 = new TemplateVariable({
      name: 'var',
    });
		expect(variableDependsOn(variable1, variable2)).toBe(false);
	});

  it('similar name no dependency', () => {
    const variable1 = new TemplateVariable({
      name: 'var1',
      intput: false,
      expression: 'testvar(param1)',
    });
    const variable2 = new TemplateVariable({
      name: 'var',
    });
		expect(variableDependsOn(variable1, variable2)).toBe(false);
	});
});

describe('test order of calculating variables', () => {
  it('test no sort required', () => {
    const variable1 = new TemplateVariable({
      name: 'var1',
      input: false,
      expression: 'cammelCase(var2)',
    });
    const variable2 = new TemplateVariable({
      name: 'var2',
    });

    const sortedVariables = sortCalculatedVariablesDependencies([variable1, variable2]);
    expect(sortedVariables).toStrictEqual([variable2, variable1]);
  });

  it('test simple sort required', () => {
    const variable1 = new TemplateVariable({
      name: 'var1',
      input: false,
      expression: 'cammelCase(var2)',
    });
    const variable2 = new TemplateVariable({
      name: 'var2',
    });

    const sortedVariables = sortCalculatedVariablesDependencies([variable2, variable1]);
    expect(sortedVariables).toStrictEqual([variable2, variable1]);
  });

  it('test complex sort required', () => {
    const variable1 = new TemplateVariable({
      name: 'var1',
      input: false,
      expression: 'cammelCase(var2)',
    });
    const variable2 = new TemplateVariable({
      name: 'var2',
      input: false,
      expression: 'something(var3)',
    });
    const variable3 = new TemplateVariable({
      name: 'var3',
      input: false,
      expression: 'something()',
    });

    const sortedVariables = sortCalculatedVariablesDependencies([variable3, variable2, variable1]);
    expect(sortedVariables).toStrictEqual([variable3, variable2, variable1]);
  });

  it('test complex sort required reverse', () => {
    const variable1 = new TemplateVariable({
      name: 'var1',
      input: false,
      expression: 'cammelCase(var2)',
    });
    const variable2 = new TemplateVariable({
      name: 'var2',
      input: false,
      expression: 'something(var3)',
    });
    const variable3 = new TemplateVariable({
      name: 'var3',
      input: false,
      expression: 'something()',
    });

    const sortedVariables = sortCalculatedVariablesDependencies([variable1, variable2, variable3]);
    expect(sortedVariables).toStrictEqual([variable3, variable2, variable1]);
  });

  it('test complex cycle dependency', () => {
    const variable1 = new TemplateVariable({
      name: 'var1',
      input: false,
      expression: 'cammelCase(var2)',
    });
    const variable2 = new TemplateVariable({
      name: 'var2',
      input: false,
      expression: 'something(var3)',
    });
    const variable3 = new TemplateVariable({
      name: 'var3',
      input: false,
      expression: 'something(var1)',
    });

    const test = () => {
      sortCalculatedVariablesDependencies([variable1, variable2, variable3]);
    };
    expect(test).toThrowError(CycleDependencyError);
  });
});

describe('test calculation of expressions', () => {
  const workspaceDir = join(tmpdir(), 'workspaceDir');
  const functionsMap = getPredefinedFunctions(workspaceDir);

  it('test camelCase', () => {
    expect(calculateExpression(functionsMap, [{name: 'var1', value: 'FooBar'}], 'camelCase(var1)')).toBe('fooBar');
  });

  it('test camelCase underscore', () => {
    expect(calculateExpression(functionsMap, [{name: 'var1', value: 'Foo_Bar'}], 'camelCase(var1)')).toBe('fooBar');
  });

  it('test pascalCase', () => {
    expect(calculateExpression(functionsMap, [{name: 'var1', value: 'fooBar'}], 'pascalCase(var1)')).toBe('FooBar');
  });

  it('test pascalCase underscore', () => {
    expect(calculateExpression(functionsMap, [{name: 'var1', value: 'foo_bar'}], 'pascalCase(var1)')).toBe('FooBar');
  });

  it('test snakeCase', () => {
    expect(calculateExpression(functionsMap, [{name: 'var1', value: 'fooBar'}], 'snakeCase(var1)')).toBe('foo_bar');
  });

  it('test snakeCase underscore', () => {
    expect(calculateExpression(functionsMap, [{name: 'var1', value: 'FooBar'}], 'snakeCase(var1)')).toBe('foo_bar');
  });

  it('test workspaceToAbsolutePath underscore', () => {
    expect(calculateExpression(functionsMap, [{name: 'var1', value: 'FooBar'}], 'workspaceToAbsolutePath(var1)'))
      .toBe(join(workspaceDir, 'FooBar'));
  });

  it('test workspaceToAbsolutePath underscore', () => {
    expect(calculateExpression(functionsMap, [{name: 'var1', value: 'FooBar/value'}], 'workspaceToAbsolutePath(var1)'))
      .toBe(join(workspaceDir, 'FooBar/value'));
  });

  it('test absoluteToWorkspacePath underscore', () => {
    expect(calculateExpression(functionsMap, [{name: 'var1', value: join(workspaceDir, 'FooBar/value')}], 'absoluteToWorkspacePath(var1)'))
      .toBe(join('FooBar', 'value'));
  });

  it('test pathJoin 2 segments', () => {
    expect(calculateExpression(
      functionsMap,
      [
        {name: 'var1', value: 'FooBar'},
        {name: 'var2', value: 'value'},
      ],
      'pathJoin(var1, var2)',
    )).toBe(join('FooBar', 'value'));
  });
  it('test pathJoin 3 segments', () => {
    expect(calculateExpression(
      functionsMap,
      [
        {name: 'var1', value: 'FooBar'},
        {name: 'var2', value: 'value'},
        {name: 'var3', value: '1'}
      ],
      'pathJoin(var1, var2, var3)',
    )).toBe(join('FooBar', 'value', '1'));
  });
});
