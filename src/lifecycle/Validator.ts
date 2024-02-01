import Variable from '../utils/Variable';

import { IVariableDescription, EVariableType } from '../utils/types';

class Validator {
  public validateEnvironment(envVarDescriptions: IVariableDescription[]) {
    for (const envVarDescription of envVarDescriptions) {
      this.validateEnvironmentVariable(envVarDescription);
    }
  }

  private validateEnvironmentVariable(envVarDescription: IVariableDescription) {
    const { isRequired, partOfEnum } = envVarDescription;
    const envVarValue = process.env[envVarDescription.target];

    if (isRequired && (!envVarValue || envVarValue === 'undefined')) {
      throw new Error(
        `Environment variable ${envVarDescription.target} is required`
      );
    }

    if (envVarValue) {
      this.validateEnvironmentVariableType(envVarDescription, envVarValue);

      if (partOfEnum) {
        this.validateEnvironmentVariableEnum(envVarDescription, envVarValue);
      }

      this.validateDecoratedProperties(envVarDescription, envVarValue);
    }
  }

  private validateEnvironmentVariableType(
    envVarDescription: IVariableDescription,
    envVarValue: string
  ) {
    switch (envVarDescription.type) {
      case EVariableType.NUMBER:
        if (!Variable.isNumber(envVarValue)) {
          throw new Error(
            `Environment variable ${envVarDescription.target} must be a castable number`
          );
        }
        break;

      case EVariableType.BOOLEAN:
        if (!Variable.isBoolean(envVarValue)) {
          throw new Error(
            `Environment variable ${envVarDescription.target} must be a castable boolean`
          );
        }
        break;

      case EVariableType.ARRAY_NUMBER:
        if (!Variable.isArrayOfNumbers(envVarValue)) {
          throw new Error(
            `Environment variable ${envVarDescription.target} must be a castable array of numbers`
          );
        }
        break;

      case EVariableType.DATE:
        if (!Variable.isDate(envVarValue)) {
          throw new Error(
            `Environment variable ${envVarDescription.target} must be a castable date`
          );
        }
        break;
    }
  }

  private validateDecoratedProperties(
    envVarDescription: IVariableDescription,
    envVarValue: string
  ) {
    const { isCronString } = envVarDescription;

    if (isCronString && !Variable.isCronString(envVarValue)) {
      throw new Error(
        `Environment variable ${envVarDescription.target} must be a valid cron string`
      );
    }
  }

  private validateEnvironmentVariableEnum(
    envVarDescription: IVariableDescription,
    envVarValue: string
  ) {
    const { partOfEnum, type } = envVarDescription;

    switch (true) {
      case type === EVariableType.NUMBER &&
        !Variable.isPartOfNumberEnum(envVarValue, <number[]>partOfEnum):
      case type === EVariableType.STRING &&
        !Variable.isPartOfStringEnum(envVarValue, <string[]>partOfEnum):
        throw new Error(
          `Environment variable ${envVarDescription.target} must be one of [${envVarDescription.partOfEnum}]`
        );
    }
  }
}

export default new Validator();
