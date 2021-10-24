import { TemplateParameter } from "./generator";
import { IFileManager } from './IFileNamager';

export interface IPostGenerateAction {
  execute(
    currentValues: Array<TemplateParameter>,
    fileManager: IFileManager,
  ):void;
}