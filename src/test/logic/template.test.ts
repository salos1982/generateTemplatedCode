import { WrongVariableNameError } from "../../logic/errors";
import { TemplateVariable } from "../../logic/TemplateVariable";

describe('test TemplateVariables', () => {
  it('test variable name success', () => {
    expect(new TemplateVariable({
      name: 'testName',
    })).toBeDefined();
  });

  it('test variable name with space', () => {
    const test = () => {
      return new TemplateVariable({
        name: 'test name',
      });
    };
    expect(test).toThrowError(WrongVariableNameError);
  });
});
