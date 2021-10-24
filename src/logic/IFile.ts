export interface IFile {
  getContent(): string;
  insertString(position: number, data: string): void;
  insertStringIndentedWithNewLine(position: number, data: string, indent: string): void;
  appendWithNewLine(data: string): void;
  appendIndentedWithNewLine(data: string, indent: string): void;
  getStartOfLinePositionWithText(text: string): number;
  getNextLinePosition(textPosition: number): number;
  getLineIndent(textPosition: number): string;
  save(): void;
}