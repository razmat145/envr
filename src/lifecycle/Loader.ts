import Variable from '../utils/Variable';

import { IVariableDescription, EVariableType } from '../utils/types';

class Loader<T extends Object> {
  public loadEnvVariables(variables: IVariableDescription[]): T {
    const config = {};

    for (const variable of variables) {
      this.assignNestedKeyByRef(
        config,
        variable.name,
        this.loadEnvVariable(variable)
      );
    }

    return config as T;
  }

  private assignNestedKeyByRef<T extends Object>(
    env: T,
    path: string,
    value: unknown
  ) {
    const keys = path.split('.');

    while (keys.length > 1) {
      const currentNestingLevel = keys.shift();

      if (!(currentNestingLevel in env)) {
        env[currentNestingLevel] = {};
      }

      env = env[currentNestingLevel];
    }

    env[keys.shift()] = value;
  }

  private loadEnvVariable(variable: IVariableDescription): unknown {
    const envVarValue = process.env[variable.target];

    if (envVarValue) {
      return this.loadEnvVariableType(variable, envVarValue);
    }

    if (variable.defaultsTo) {
      return variable.defaultsTo;
    }

    return null;
  }

  private loadEnvVariableType(
    variable: IVariableDescription,
    envVarValue: string
  ): unknown {
    switch (variable.type) {
      case EVariableType.STRING:
        return Variable.extractString(envVarValue);

      case EVariableType.NUMBER:
        return Variable.extractNumber(envVarValue);

      case EVariableType.BOOLEAN:
        return Variable.extractBoolean(envVarValue);

      case EVariableType.ARRAY_STRING:
        return Variable.extractArrayOfStrings(envVarValue);

      case EVariableType.ARRAY_NUMBER:
        return Variable.extractArrayOfNumbers(envVarValue);

      default:
        throw new Error(
          `Environment variable ${variable.name} has an unsupported or not yet implemented type`
        );
    }
  }
}

export default new Loader();
