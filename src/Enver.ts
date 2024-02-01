import { Environment } from './Environment';

import { IEnverConfig } from './utils/types';

export class Enver<T extends Object> {
  private static instance: Enver<any>;

  private environment: Environment<T>;

  private constructor() {}

  public static async initialize<T extends Object>(opts?: IEnverConfig) {
    if (Enver.instance) {
      return;
    }

    const enver = new Enver<T>();
    const environment = new Environment<T>(opts);

    await environment.initialize();

    enver.environment = environment;
    Enver.instance = enver;
  }

  public static getEnv<T extends Object>(): T {
    if (!Enver.instance) {
      throw new Error('Environment is not initialized');
    }

    return Enver.instance.environment.getEnv();
  }

  public static get<T, K extends keyof T>(key: K): T[K];
  public static get<T, K extends keyof T, U extends keyof T[K]>(
    key: K,
    l1SubKey: U
  ): T[K][U];
  public static get<
    T,
    K extends keyof T,
    U extends keyof T[K],
    V extends keyof T[K][U]
  >(key: K, l1SubKey: U, l2SubKey: V): T[K][U][V];
  public static get<
    T,
    K extends keyof T,
    U extends keyof T[K],
    V extends keyof T[K][U]
  >(key: K, l1SubKey?: U, l2SubKey?: V): T[K] | T[K][U] | T[K][U][V] {
    if (!Enver.instance) {
      throw new Error('Environment is not initialized');
    }

    const baseValue = Enver.instance.environment.get(key);
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
