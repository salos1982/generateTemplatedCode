import { TemplateVariable } from "./TemplateVariable";
import { CycleDependencyError } from './errors';
import { TemplateParameter } from "./generator";

interface GraphNode {
  variable: TemplateVariable;
  dependsOn: Set<GraphNode>
  dependsFrom: Set<GraphNode>
}

export function sortCalculatedVariablesDependencies(variables:Array<TemplateVariable>): Array<TemplateVariable> {
  const graphNodes: Array<GraphNode> = [];
  for (let i = 0; i < variables.length; i++) {
    graphNodes.push({
      variable: variables[i],
      dependsOn: new Set<GraphNode>(),
      dependsFrom: new Set<GraphNode>(),
    });
  }

  for (let i = 0; i < graphNodes.length; i++) {
    for (let j = i + 1; j < graphNodes.length; j++) {
      const node1 = graphNodes[i];
      const node2 = graphNodes[j];
      if (variableDependsOn(node1.variable, node2.variable)) {
        node1.dependsOn.add(node2);
        node2.dependsFrom.add(node1);
      }

      if (variableDependsOn(node2.variable, node1.variable)) {
        node2.dependsOn.add(node1);
        node1.dependsFrom.add(node2);
      }
    }
  }

  const result:Array<TemplateVariable> = [];
  while(graphNodes.length) {
    // looking for nodes without dependecies
    let dependeciesChanged = false;
    for (let i = graphNodes.length - 1; i >= 0; i--) {
      const node = graphNodes[i];
      if (node.dependsOn.size === 0) {
        // no dependecy for other variables
        dependeciesChanged = true;
        result.push(node.variable);
        graphNodes.splice(i, 1);
        node.dependsFrom.forEach(item => {
          item.dependsOn.delete(node);
        });
      }
    }

    if (!dependeciesChanged) {
      throw new CycleDependencyError(graphNodes.map(item => item.variable.name));
    }
  }

  return result;
}

export function variableDependsOn(var1: TemplateVariable, var2: TemplateVariable): boolean {
  const regEx = new RegExp(`\\b${var2.name}\\b`);
  const matchResult = regEx.exec(var1.expression!);
  return matchResult !== null;
}

export function calculateExpression(
  functionsMap: Map<string, Function>,
  currentValues: Array<TemplateParameter>,
  expression: string
): any {
  const functionParameters = currentValues.map(item => item.name);
  const functionParamatersValues:Array<any> = currentValues.map(item => item.value);
  functionsMap.forEach((value: Function, key: string) => {
    functionParameters.push(key);
    functionParamatersValues.push(value);
  });

  const func = new Function(...functionParameters, `return ${expression}`);
  const value = func(...functionParamatersValues);
  return value;
}
