import * as vscode from 'vscode';

export function getWorkspaceDirectory(): string | null
{
  if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length) {
    return vscode.workspace.workspaceFolders[0].uri.fsPath.replaceAll('\\', '/');
  }

  return null;
}

export function getEndOfLineValue() : string {
  const endOfLine:string = vscode.workspace.getConfiguration('files').get('eol')!;
  return endOfLine;
}