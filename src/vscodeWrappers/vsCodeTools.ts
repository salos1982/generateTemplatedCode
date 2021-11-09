import * as vscode from 'vscode';

export function getWorkspaceDirectory(): string | null
{
  if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length) {
    return vscode.workspace.workspaceFolders[0].uri.fsPath;
  }

  return null;
}

export function getEndOfLineValue() : string {
  return '\n';
}