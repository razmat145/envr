import { Environment } from './Environment';

import { IEnverConfig } from './utils/types';

export class Enver<GenericEnvironmentType extends Object> {
  private static instance: Enver<any>;

  private environment: Environment<GenericEnvironmentType>;

  private constructor() {}

  public static async initialize<GenericEnvironmentType extends Object>(
    opts?: IEnverConfig
  ) {
    if (Enver.instance) {
      return;
    }

    const enver = new Enver<GenericEnvironmentType>();
    const environment = new Environment<GenericEnvironmentType>(opts);

    await environment.initialize();

    enver.environment = environment;
    Enver.instance = enver;
  }

  public static getEnv<
    GenericEnvironmentType extends Object
  >(): GenericEnvironmentType {
    if (!Enver.instance) {
      throw new Error('Environment is not initialized');
    }

    return Enver.instance.environment.getEnv();
  }

  public static get<
    GenericEnvironmentType,
    GenericRootProperty extends keyof GenericEnvironmentType
  >(key: GenericRootProperty): GenericEnvironmentType[GenericRootProperty];
  public static get<
    GenericEnvironmentType,
    GenericRootProperty extends keyof GenericEnvironmentType,
    GenericFirstLevelNesting extends keyof GenericEnvironmentType[GenericRootProperty]
  >(
    key: GenericRootProperty,
    l1SubKey: GenericFirstLevelNesting
  ): GenericEnvironmentType[GenericRootProperty][GenericFirstLevelNesting];
  public static get<
    GenericEnvironmentType,
    GenericRootProperty extends keyof GenericEnvironmentType,
    GenericFirstLevelNesting extends keyof GenericEnvironmentType[GenericRootProperty],
    GenericSecondLevelNesting extends keyof GenericEnvironmentType[GenericRootProperty][GenericFirstLevelNesting]
  >(
    key: GenericRootProperty,
    l1SubKey: GenericFirstLevelNesting,
    l2SubKey: GenericSecondLevelNesting
  ): GenericEnvironmentType[GenericRootProperty][GenericFirstLevelNesting][GenericSecondLevelNesting];
  public static get<
    GenericEnvironmentType,
    GenericRootProperty extends keyof GenericEnvironmentType,
    GenericFirstLevelNesting extends keyof GenericEnvironmentType[GenericRootProperty],
    GenericSecondLevelNesting extends keyof GenericEnvironmentType[GenericRootProperty][GenericFirstLevelNesting]
  >(
    key: GenericRootProperty,
    l1SubKey?: GenericFirstLevelNesting,
    l2SubKey?: GenericSecondLevelNesting
  ):
    | GenericEnvironmentType[GenericRootProperty]
    | GenericEnvironmentType[GenericRootProperty][GenericFirstLevelNesting]
    | GenericEnvironmentType[GenericRootProperty][GenericFirstLevelNesting][GenericSecondLevelNesting] {
    if (!Enver.instance) {
      throw new Error('Environment is not initialized');
    }

    const baseValue = Enver.instance.environment.get<GenericRootProperty>(key);
    if (!l1SubKey) {
      return baseValue;
    }

    const l1Value = baseValue?.[l1SubKey];
    if (!l2SubKey) {
      return l1Value;
    }

    return l1Value?.[l2SubKey];
  }

  public static has(path: string): boolean {
    if (!Enver.instance) {
      throw new Error('Environment is not initialized');
    }

    return Enver.instance.environment.has(path);
  }
}
