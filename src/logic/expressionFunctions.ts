import { readFileSync } from 'fs';
import { join } from 'path';

const camelCaseLib = require('camelcase');
import { snakeCase as snakeCaseLib } from "snake-case";
import { WrongRelativePathError } from './errors';
import * as dashify from 'dashify';
import { generate } from 'generate-password';

function camelCase(str: string): string {
  return camelCaseLib(str, { preserveConsecutiveUppercase: true });
}

function pascalCase(str: string): string {
  return camelCaseLib(str, { pascalCase: true, preserveConsecutiveUppercase: true });
}

function snakeCase(str: string): string {
  return snakeCaseLib(str);
}

function fileContent(path: string): string {
  return readFileSync(path, { encoding: 'utf-8'});
}

function workspaceToAbsolutePath(workspacePath: string): (path:string) => string {
  return (path:string):string =>  {
    return join(workspacePath, path);
  };
}

function absoluteToWorkspacePath(workspacePath: string): (path:string) => string {
  return (path:string):string =>  {
    if (path.startsWith(workspacePath)) {
      return path.substring(workspacePath.length + 1);
    }
    throw new WrongRelativePathError(path, workspacePath);
  };
}

function dashCase(str: string): string {
  return dashify(str);
}

function pathJoin(...paths:Array<string>): string {
  return join(...paths).replaceAll('\\', '/');
}

function generatePassword(length: number): string {
  return generate({
    length: length || 12,
    numbers: true,
    lowercase: true,
    uppercase: true,
    symbols: true,
    strict: true,
    exclude: '\'"`@!'
  });
}

function urlEncode(str: string) : string {
  return encodeURIComponent(str);
}

function escapeQuotes(str: string): string {
  return str.replaceAll('"', '\\"');
}

export function getPredefinedFunctions(workspaceDirectory:string): Map<string, Function> {
  const result = new Map<string, Function>();
  result.set('camelCase', camelCase);
  result.set('pascalCase', pascalCase);
  result.set('snakeCase', snakeCase);
  result.set('fileContent', fileContent);
  result.set('workspaceToAbsolutePath', workspaceToAbsolutePath(workspaceDirectory));
  result.set('absoluteToWorkspacePath', absoluteToWorkspacePath(workspaceDirectory));
  result.set('pathJoin', pathJoin);
  result.set('dashCase', dashCase);
  result.set('generatePassword', generatePassword);
  result.set('urlEncode', urlEncode);
  result.set('escapeQuotes', escapeQuotes);

  return result;
}