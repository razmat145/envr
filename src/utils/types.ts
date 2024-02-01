export interface IVariableDescription {
  name: string;

  target: string;

  type: EVariableType;

  isRequired?: boolean;

  defaultsTo?: unknown;

  partOfEnum?: Array<string | number>;
}

export enum EVariableType {
  STRING = 'string',

  NUMBER = 'number',

  BOOLEAN = 'boolean',

  ARRAY_STRING = 'string[]',

  ARRAY_NUMBER = 'number[]',

  DATE = 'date',
}

export interface IEnverConfig {
  targetPath?: string;
}
