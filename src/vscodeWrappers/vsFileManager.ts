import { IFile } from '../logic/IFile';
import { IFileManager } from './../logic/IFileNamager';
import { window, TextEditor } from 'vscode';
import { VSEditorFile } from './vsEditorFile';
import { FsFile } from './../logic/FsFile';

export class VSFileManager implements IFileManager {
  endOfLine: string;

  constructor(endOfLine: string) {
    this.endOfLine = endOfLine;
  }

  getFile(fileName: string): IFile {
    const editor = window.visibleTextEditors.find((element: TextEditor) => {
      return element.document.fileName === fileName;
    });

    if (editor) {
      return new VSEditorFile(editor);
    }

    return new FsFile(fileName, this.endOfLine);
  }
  
}
