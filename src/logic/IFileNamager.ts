import { IFile } from "./IFile";

export interface IFileManager {
  getFile(fileName: string): IFile;
}