import {
  mkdirSync,
  readdirSync,
  statSync,
  readFileSync,
  writeFileSync,
  existsSync,
} from 'fs';
import { join } from 'path';

export interface TemplateParameter {
  name: string;
  value: string;
}

export function generateModule(
  baseTemplatePath: string,
  basePath: string,
  templateParameters: Array<TemplateParameter>
) {
  if (!existsSync(basePath)) {
    mkdirSync(basePath);
  }

  const templateFiles = readdirSync(baseTemplatePath);
  templateFiles.forEach(file => {
    const templateFile = join(baseTemplatePath, file);
    const destinationFile = join(basePath, processTemplateParams(file, templateParameters));
    if (statSync(templateFile).isDirectory()) {
      generateModule(templateFile, destinationFile, templateParameters);
    } else {
      processTemplateFile(templateFile, destinationFile, templateParameters);
    }
    
  });
}

function processTemplateFile(sourceFile: string, destinationFile: string, templateParameters: Array<TemplateParameter>) {
  const sourceData = readFileSync(sourceFile, { encoding: 'utf8' });
  const result = processTemplateParams(sourceData, templateParameters);
  writeFileSync(destinationFile, result);
}

export function processTemplateParams(sourceString: string, templateParameters: Array<TemplateParameter>) {
  return templateParameters.reduce((processedValue, curParam) => {
    return processedValue.replaceAll(`{{${curParam.name}}}`, curParam.value);
  }, sourceString);
}