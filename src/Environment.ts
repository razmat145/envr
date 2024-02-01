import fs from 'fs/promises';

import type { ITypeDescription } from 'tparserr';

import Parser from './lifecycle/Parser';
import Validator from './lifecycle/Validator';
import Loader from './lifecycle/Loader';
import Getter from './lifecycle/Getter';

import { IEnverConfig } from './utils/types';

export class Environment<T extends Object> {
  protected loadedEnv: T;

  private isInitialized = false;

  constructor(private opts: IEnverConfig = {}) {}

  public async initialize() {
    const envJson = await this.loadEnvJson();

    const envDescription = Parser.parseEnvDescription(
      <ITypeDescription>envJson
    );

    Validator.validateEnvironment(envDescription);

    this.loadedEnv = <T>Loader.loadEnvVariables(envDescription);
    this.isInitialized = true;
  }

  public getEnv(): T {
    if (!this.isInitialized) {
      throw new Error('Environment is not initialized');
    }

    return <T>this.loadedEnv;
  }

  public get<K extends keyof T>(key: K): T[K] {
    if (!this.isInitialized) {
      throw new Error('Environment is not initialized');
    }

    return Getter.getKeyValue<T, K>(this.loadedEnv, key);
  }

  public has(key: string): boolean {
    if (!this.isInitialized) {
      throw new Error('Environment is not initialized');
    }

    return Getter.hasKeyValue(this.loadedEnv, key);
  }

  private async loadEnvJson(): Promise<ITypeDescription> {
    const data = await fs.readFile(
      this.opts?.targetPath || './env.json',
      'utf-8'
    );

    let typeDescription: ITypeDescription[];
    try {
      typeDescription = JSON.parse(data.toString());
    } catch (err) {
      throw new Error(`Invalid ${this.opts?.targetPath || './env.json'}`);
    }

    const envJson = typeDescription.find(
      (description) => description.name === 'Environment'
    );

    if (!envJson) {
      throw new Error('Environment description not found');
    }

    return envJson;
  }
}
