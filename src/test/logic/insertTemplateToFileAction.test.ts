
import { mkdirSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { FsFile } from '../../logic/FsFile';
import { IFile } from '../../logic/IFile';
import { IFileManager } from '../../logic/IFileNamager';
import { InsertTemplateToFileAction } from './../../logic/insertTemplateToFileAction';
import { readFileSync } from 'fs';

describe('test inserting templates into file', () => {
  const dir = join(tmpdir(), 'insertTemplateActon');

  beforeAll(() => {
    mkdirSync(dir, { recursive: true });
  });

  afterAll(() => {
    rmSync(dir, { force: true, recursive: true });
  });

  it('insert single line template after', () => {
    const testFileToInsert = join(dir, 'fileToInsert1');
    const fileToInsertContent = 'start of file\n  //my string\n  //end my string\nend of file';
    writeFileSync(testFileToInsert, fileToInsertContent);
    const template = {
      fileName: testFileToInsert,
      snippet: 'my string',
      template: 'my module',
      position: 'after',
    };

    const testFileManager: IFileManager = {
      getFile: function (fileName: string): IFile {
        return new FsFile(fileName, '\n');
      }
    };

    const action = new InsertTemplateToFileAction(template);
    action.execute([], testFileManager);

    const resultContent = readFileSync(testFileToInsert, { encoding: 'utf-8'});
    expect(resultContent).toBe('start of file\n  //my string\n  my module\n  //end my string\nend of file');
  });

  it('insert single line template before', () => {
    const testFileToInsert = join(dir, 'fileToInsert1');
    const fileToInsertContent = 'start of file\n  //my string\n  //end my string\nend of file';
    writeFileSync(testFileToInsert, fileToInsertContent);
    const template = {
      fileName: testFileToInsert,
      snippet: '//end my string',
      template: 'my module',
      position: 'before',
    };

    const testFileManager: IFileManager = {
      getFile: function (fileName: string): IFile {
        return new FsFile(fileName, '\n');
      }
    };

    const action = new InsertTemplateToFileAction(template);
    action.execute([], testFileManager);

    const resultContent = readFileSync(testFileToInsert, { encoding: 'utf-8'});
    expect(resultContent).toBe('start of file\n  //my string\n  my module\n  //end my string\nend of file');
  });

  it('insert multiline line template after', () => {
    const testFileToInsert = join(dir, 'fileToInsert1');
    const fileToInsertContent = 'start of file\n  //my string\n  //end my string\nend of file';
    writeFileSync(testFileToInsert, fileToInsertContent);
    const template = {
      fileName: testFileToInsert,
      snippet: 'my string',
      template: 'my module {\n  code ofmodule\n}',
      position: 'after',
    };

    const testFileManager: IFileManager = {
      getFile: function (fileName: string): IFile {
        return new FsFile(fileName, '\n');
      }
    };

    const action = new InsertTemplateToFileAction(template);
    action.execute([], testFileManager);

    const resultContent = readFileSync(testFileToInsert, { encoding: 'utf-8'});
    expect(resultContent).toBe('start of file\n  //my string\n  my module {\n    code ofmodule\n  }\n  //end my string\nend of file');
  });

  it('insert multiline line template before', () => {
    const testFileToInsert = join(dir, 'fileToInsert1');
    const fileToInsertContent = 'start of file\n  //my string\n  //end my string\nend of file';
    writeFileSync(testFileToInsert, fileToInsertContent);
    const template = {
      fileName: testFileToInsert,
      snippet: '//end my string',
      template: 'my module {\n  code ofmodule\n}',
      position: 'before',
    };

    const testFileManager: IFileManager = {
      getFile: function (fileName: string): IFile {
        return new FsFile(fileName, '\n');
      }
    };

    const action = new InsertTemplateToFileAction(template);
    action.execute([], testFileManager);

    const resultContent = readFileSync(testFileToInsert, { encoding: 'utf-8'});
    expect(resultContent).toBe('start of file\n  //my string\n  my module {\n    code ofmodule\n  }\n  //end my string\nend of file');
  });
});
