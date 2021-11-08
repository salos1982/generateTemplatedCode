import { IFile } from './IFile';
import { IFileManager } from './IFileNamager';
import { FsFile } from './FsFile';

export class FileManager implements IFileManager {
  endOfLine: string;
  
  constructor(endOfLine: string) {
    this.endOfLine = endOfLine;
  }

  getFile(fileName: string): IFile {
    return new FsFile(fileName, this.endOfLine);
  }

};
