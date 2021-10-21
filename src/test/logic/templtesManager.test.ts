import { mkdir, mkdirSync, unlink, unlinkSync } from 'fs';
import 'jest-extended';
import { tmpdir } from 'os';
import { join } from 'path';

import { TemplateVariable } from '../../logic/template';
import { TemplatesManager } from './../../logic/templatesManager';

describe('test calculating variables', () => {
  let templatesManager:TemplatesManager;
  let workspacePath:string;
  const uiProvider = {
    async getUserText(title:string, promt: string): Promise<string|undefined> {
      return undefined;
    }
  };

  beforeAll(() => {
    workspacePath = join(tmpdir(), 'workspace1');
    mkdirSync(workspacePath);

    templatesManager = new TemplatesManager(workspacePath, uiProvider);
  });

  afterAll(() => {
    unlinkSync(workspacePath);
  });

});