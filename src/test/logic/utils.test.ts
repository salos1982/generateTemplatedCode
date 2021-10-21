import { TemplateVariable } from '../../logic/template';
import { variableDependsOn, sortCalculatedVariablesDependencies } from '../../logic/utils';
import { CycleDependencyError } from './../../logic/errors';


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
