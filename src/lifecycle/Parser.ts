import type { ITypeDescription } from 'tparserr';

import { IVariableDescription, EVariableType } from '../utils/types';

class Parser {
  public parseEnvDescription(
    typeDescription: ITypeDescription,
    prefix = ''
  ): IVariableDescription[] {
    const variables: IVariableDescription[] = [];

    for (const key in typeDescription.properties) {
      const variableDescription = this.parseVariableDescription(
        key,
        typeDescription.properties[key]
      );

      if (prefix) {
        variableDescription.name = `${prefix}.${variableDescription.name}`;
      }

      if (typeDescription.properties[key].properties) {
        const nestedVariables = this.parseEnvDescription(
          typeDescription.properties[key],
          variableDescription.name
        );

        variables.push(...nestedVariables);
      } else {
        variables.push(variableDescription);
      }
    }

    return variables;
  }

  private parseVariableDescription(
    name: string,
    typeDescription: ITypeDescription
  ): IVariableDescription {
    const variableDescription: IVariableDescription = {
      name,
      target: name,
      type: EVariableType.STRING,
    };

    if (typeDescription.type) {
      variableDescription.type = this.extractVariableType(typeDescription);
    }

    if (typeDescription.required) {
      variableDescription.isRequired = typeDescription.required;
    }

    if (typeDescription.annotations) {
      for (const annotation of typeDescription.annotations) {
        switch (annotation.name) {
          case 'EnvVariable':
            variableDescription.target = annotation.args[0];
            break;

          case 'IsPartOfEnum':
            variableDescription.partOfEnum = annotation.args[0];
            break;

          case 'DefaultsTo':
            variableDescription.defaultsTo = annotation.args[0];
            break;

          default:
            break;
        }
      }
    }

    return variableDescription;
  }

  private extractVariableType(
    typeDescription: ITypeDescription
  ): EVariableType {
    const { type } = typeDescription;

    switch (type) {
      case 'string':
        return EVariableType.STRING;

      case 'number':
        return EVariableType.NUMBER;

      case 'boolean':
        return EVariableType.BOOLEAN;

      case 'array':
        return `${this.extractVariableType(
          typeDescription.items
        )}[]` as EVariableType;

      case 'Date':
        return EVariableType.DATE;

      default:
        return EVariableType.STRING;
    }
  }
}

export default new Parser();
