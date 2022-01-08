import { WrongFileNameForSnippet, WrongSnippet, WrongFileNameError, NoSnippetError, WrongPositionValue } from '../errors';
import { IPostGenerateAction } from './IPostGenerateAction';
import { existsSync } from 'fs';
import { statSync } from 'fs';
import { processTemplateParams, TemplateParameter } from '../generator';
import { IFileManager } from '../IFileNamager';

enum InsertPosition {
  before = 'before',
  after = 'after',
}

export class InsertTemplateToFileAction implements IPostGenerateAction {
  fileName: string;
  snippet: string;
  template: string;
  position: InsertPosition;

  constructor(config: any) {
    if (!config.fileName) {
      throw new WrongFileNameForSnippet();
    }
    if (!config.snippet) {
      throw new WrongSnippet();
    }
    this.fileName = config.fileName;
    this.snippet = config.snippet;
    this.template = config.template;
    
    if (config.position === InsertPosition.before || config.position === InsertPosition.after) {
      this.position = config.position;
    } else {
      throw new WrongPositionValue();
    }
  }

  async execute(currentValues: Array<TemplateParameter>, fileManager: IFileManager): Promise<void> {
    this.fileName = processTemplateParams(this.fileName, currentValues);
    if (!existsSync(this.fileName) || !statSync(this.fileName).isFile()) {
      throw new WrongFileNameError(this.fileName);
    }

    const file = fileManager.getFile(this.fileName);
    const startOfLine = file.getStartOfLinePositionWithText(this.snippet);
    if (startOfLine === -1) {
      throw new NoSnippetError(this.snippet, this.fileName);
    }

    const indent = file.getLineIndent(startOfLine);
    const processedTemplate = processTemplateParams(this.template, currentValues);
    if (this.position === InsertPosition.before) {
      file.insertStringIndentedWithNewLine(startOfLine, processedTemplate, indent);
    } else if (this.position === InsertPosition.after) {
      const startNextLine = file.getNextLinePosition(startOfLine);
      if (startNextLine === -1) {
        file.appendIndentedWithNewLine(processedTemplate, indent);
      } else {
        file.insertStringIndentedWithNewLine(startNextLine, processedTemplate, indent);
      }
    }

    file.save();
  }
}
