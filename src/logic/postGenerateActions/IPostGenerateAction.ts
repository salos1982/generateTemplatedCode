import { TemplateParameter } from '../generator';
import { IFileManager } from '../IFileNamager';
import { IUIProvider } from '../IUIProvider';

export interface IPostGenerateAction {
  execute(
    currentValues: Array<TemplateParameter>,
    fileManager: IFileManager,
    uiProvider: IUIProvider,
  ): Promise<void>;
}