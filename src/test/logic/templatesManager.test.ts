import { mkdirSync, unlinkSync, existsSync, readFileSync } from 'fs';
import { copySync, remove } from 'fs-extra';
import 'jest-extended';
import { tmpdir } from 'os';
import { join } from 'path';
import { configFileName } from '../../logic/constants';

import { TemplatesManager } from '../../logic/templatesManager';

describe('test generating templates', () => {
  let workspacePath:string;
  
  beforeEach(() => {
    workspacePath = join(tmpdir(), `workspace${new Date().getTime()}`);
    mkdirSync(workspacePath);
  });

  afterEach(() => {
    remove(workspacePath);
  });

  it('test simple file creation with workspaceDir', async () => {
    copySync(join(__dirname, '../data/simpleTest'), workspacePath);
    const nameOfModule = 'Test';
    const uiProvider = {
      async getUserText(title:string, promt: string): Promise<string|undefined> {
        return nameOfModule;
      }
    };

    const templatesManager = new TemplatesManager(workspacePath, uiProvider);
    await templatesManager.applyTemplate(templatesManager.template, null);
    const generatedFilePath = join(workspacePath, `${nameOfModule}.js`);
    expect(existsSync(generatedFilePath)).toBeTrue();
    const generatedFile = readFileSync(generatedFilePath, { encoding: 'utf-8'});
    expect(generatedFile).toBe('// file Test\n// camelCase test\n// curDate 1/1/2021');
  });

  it('test simple file creation with context dir', async () => {
    copySync(join(__dirname, '../data/simpleTestContext'), workspacePath);
    const nameOfModule = 'Test';
    const uiProvider = {
      async getUserText(title:string, promt: string): Promise<string|undefined> {
        return nameOfModule;
      }
    };

    const contextDir = join(workspacePath, 'context');
    mkdirSync(contextDir);

    const templatesManager = new TemplatesManager(workspacePath, uiProvider);
    await templatesManager.applyTemplate(templatesManager.template, contextDir);
    const generatedFilePath = join(contextDir, `${nameOfModule}.js`);
    expect(existsSync(generatedFilePath)).toBeTrue();
    const generatedFile = readFileSync(generatedFilePath, { encoding: 'utf-8'});
    expect(generatedFile).toBe('// file Test\n// camelCase test\n// curDate 1/1/2021');
  });
});