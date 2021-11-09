import { IFile } from './../logic/IFile';
import { TextEditor, Position, TextEditorEdit, EndOfLine } from 'vscode';
import { appendIndent } from '../logic/utils';

export class VSEditorFile implements IFile {
  private editor: TextEditor;

  constructor(editor: TextEditor) {
    this.editor = editor;
  }

  getContent(): string {
    return this.editor.document.getText();
  }

  insertString(position: number, data: string): void {
    const editorPosition = this.getEditorPosition(position);
    this.editor.edit((editBuilder: TextEditorEdit) => {
      editBuilder.insert(editorPosition, data);
    });
  }

  insertStringIndentedWithNewLine(position: number, data: string, indent: string): void {
    const endOfLine = this.editor.document.eol === EndOfLine.LF ? '\n' : '\r\n';
    const indentedData = appendIndent(data, indent, endOfLine);
    this.insertString(position, indentedData + endOfLine);
  }

  appendWithNewLine(data: string): void {
    const lastLine = this.editor.document.lineAt(this.editor.document.lineCount - 1);
    const lastPosition = lastLine.rangeIncludingLineBreak.end;
    this.editor.edit((editBuilder: TextEditorEdit) => {
      editBuilder.insert(lastPosition, data);
    });
  }

  appendIndentedWithNewLine(data: string, indent: string): void {
    const endOfLine = this.editor.document.eol === EndOfLine.LF ? '\n' : '\r\n';
    const indentedData = appendIndent(data, indent, endOfLine);
    this.appendWithNewLine(indentedData);
  }

  getStartOfLinePositionWithText(text: string): number {
    const fileContent = this.getContent();
    const indexOfSnippet = fileContent.indexOf(text);
    if (indexOfSnippet === -1) {
      return -1;
    }

    const snippetPosition = this.getEditorPosition(indexOfSnippet);
    const line = this.editor.document.lineAt(snippetPosition);
    return this.editor.document.offsetAt(line.rangeIncludingLineBreak.start);
  }

  getNextLinePosition(textPosition: number): number {
    const editorPosition = this.getEditorPosition(textPosition);
    const line = this.editor.document.lineAt(editorPosition);
    if (line.lineNumber < this.editor.document.lineCount - 1) {
      const nextLine = this.editor.document.lineAt(line.lineNumber + 1);
      return this.editor.document.offsetAt(nextLine.rangeIncludingLineBreak.start);
    }
    
    return this.editor.document.offsetAt(line.rangeIncludingLineBreak.end);
  }

  getLineIndent(textPosition: number): string {
    const editorPosition = this.getEditorPosition(textPosition);
    const line = this.editor.document.lineAt(editorPosition);
    return line.text.substring(0, line.firstNonWhitespaceCharacterIndex);
  }

  async save(): Promise<void> {
    await this.editor.document.save();
  }

  private getEditorPosition(textPosition: number): Position {
    return this.editor.document.positionAt(textPosition);
  }
};
