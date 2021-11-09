import { IFile } from './IFile';
import { readFileSync, writeFileSync } from 'fs';
import { appendIndent } from './utils';

export class FsFile implements IFile {
  fileName: string;
  content: string | undefined = undefined;
  endOfLineString: string;

  constructor(fileName: string, endOfLineString: string) {
    this.fileName = fileName;
    this.endOfLineString = endOfLineString;
  }

  getContent(): string {
    if (this.content === undefined) {
      this.content = readFileSync(this.fileName, { encoding: 'utf-8'});
    }

    return this.content;
  }

  insertString(position: number, data: string): void {
    const fileContent = this.getContent();
    this.content = fileContent.substring(0, position) + data + fileContent.substring(position);
  }

  insertStringIndentedWithNewLine(position: number, data: string, indent: string): void {
    const indentedData = this.appendIndent(data, indent);
    this.insertString(position, indentedData + this.endOfLineString);
  }

  appendWithNewLine(data: string): void {
    const fileContent = this.getContent();
    this.content = fileContent + this.endOfLineString + data;
  }

  appendIndentedWithNewLine(data: string, indent: string): void {
    const indentedData = this.appendIndent(data, indent);
    this.appendWithNewLine(indentedData);
  }

  async save(): Promise<void> {
    if (this.content) {
      writeFileSync(this.fileName, this.content!);
    }
  }

  getStartOfLinePositionWithText(text: string): number {
    const fileContent = this.getContent();
    const indexOfSnippet = fileContent.indexOf(text);
    if (indexOfSnippet === -1) {
      return -1;
    }

    return this.getStartLinePositionFromTextPosition(indexOfSnippet);
  }

  getLineIndent(textPosition: number): string {
    const fileContent = this.getContent();
    const startLinePosition = this.getStartLinePositionFromTextPosition(textPosition);
    let curIndex = startLinePosition;
    while(curIndex < fileContent.length 
      && (fileContent.charAt(curIndex) === '\t' || fileContent.charAt(curIndex) === ' ')) {
      curIndex++;
    }
    return fileContent.substring(startLinePosition, curIndex);
  }

  getNextLinePosition(textPosition: number): number {
    const fileContent = this.getContent();
    const nextIndex = fileContent.indexOf(this.endOfLineString, textPosition);
    if (nextIndex === -1) {
      return -1;
    } else {
      return nextIndex + this.endOfLineString.length;
    }
  }
  
  private appendIndent(content: string, indent: string): string {
    return appendIndent(content, indent, this.endOfLineString);
  }

  private getStartLinePositionFromTextPosition(textPosition: number): number {
    const fileContent = this.getContent();
    const endOfLinePosition = fileContent.lastIndexOf(this.endOfLineString, textPosition);
    if (endOfLinePosition === -1) {
      return 0;
    } else {
      return endOfLinePosition + this.endOfLineString.length;
    }
  }
}