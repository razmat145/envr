import { describe, it, expect, jest, beforeEach } from '@jest/globals';

jest.mock('../src/lifecycle/Parser');
jest.mock('../src/lifecycle/Validator');
jest.mock('../src/lifecycle/Loader');
jest.mock('../src/lifecycle/Getter');
jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

import { Environment } from '../src/Environment';

import Parser from '../src/lifecycle/Parser';
import Validator from '../src/lifecycle/Validator';
import Loader from '../src/lifecycle/Loader';
import Getter from '../src/lifecycle/Getter';

import fs from 'fs/promises';

import { Environment as TestEnvironment } from './testEnv';
import testEnvJsonFile from './testEnv.json';
import { IEnverConfig } from '../src/utils/types';

describe('Environment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initialize', () => {
    it('should load the env.json file, parse it, validate it and load the environment variables', async () => {
      // setup
      const mockOpts = <IEnverConfig>{ targetPath: './here.json' };
      const sutInstance = new Environment(mockOpts);

      (
        fs.readFile as jest.MockedFunction<typeof fs.readFile>
      ).mockResolvedValueOnce(JSON.stringify(testEnvJsonFile));

      const mockEnvDescription = <any>{ parsed: 'envDescription' };
      (
        Parser.parseEnvDescription as jest.MockedFunction<
          typeof Parser.parseEnvDescription
        >
      ).mockReturnValueOnce(mockEnvDescription);

      (
        Validator.validateEnvironment as jest.MockedFunction<
          typeof Validator.validateEnvironment
        >
      ).mockReturnValueOnce(undefined);

      const mockLoadedEnv = <TestEnvironment>(<unknown>{ loaded: 'env' });
      (
        Loader.loadEnvVariables as jest.MockedFunction<
          typeof Loader.loadEnvVariables
        >
      ).mockReturnValueOnce(mockLoadedEnv);

      // test
      await sutInstance.initialize();

      expect(fs.readFile).toHaveBeenCalledTimes(1);
      expect(fs.readFile).toHaveBeenCalledWith(mockOpts.targetPath, 'utf-8');

      expect(Parser.parseEnvDescription).toHaveBeenCalledTimes(1);
      expect(Parser.parseEnvDescription).toHaveBeenCalledWith(
        testEnvJsonFile[0] as any
      );

      expect(Validator.validateEnvironment).toHaveBeenCalledTimes(1);
      expect(Validator.validateEnvironment).toHaveBeenCalledWith(
        mockEnvDescription
      );

      expect(Loader.loadEnvVariables).toHaveBeenCalledTimes(1);
      expect(Loader.loadEnvVariables).toHaveBeenCalledWith(mockEnvDescription);

      expect(sutInstance['loadedEnv']).toBe(mockLoadedEnv);
    });
  });

  describe('getEnv', () => {
    it('should throw an error if the environment is not initialized', () => {
      const sutInstance = new Environment();

      expect(() => sutInstance.getEnv()).toThrowError(
        'Environment is not initialized'
      );
    });

    it('should return the loaded environment', () => {
      const sutInstance = new Environment();

      sutInstance['loadedEnv'] = <TestEnvironment>(<unknown>{ loaded: 'env' });
      sutInstance['isInitialized'] = true;

      const sutResult = sutInstance.getEnv();

      expect(sutResult).toBe(sutInstance['loadedEnv']);
    });
  });

  describe('get', () => {
    it('should throw an error if the environment is not initialized', () => {
      const sutInstance = new Environment<TestEnvironment>();

      expect(() => sutInstance.get<'logLevel'>('logLevel')).toThrowError(
        'Environment is not initialized'
      );
    });

    it('should return the value of the key', () => {
      const sutInstance = new Environment<TestEnvironment>();
      sutInstance['isInitialized'] = true;

      const mockValue = 'debug';

      (
        Getter.getKeyValue as jest.MockedFunction<() => unknown>
      ).mockReturnValueOnce(mockValue);

      const sutResult = sutInstance.get<'logLevel'>('logLevel');

      expect(sutResult).toBe(mockValue);
    });
  });

  describe('has', () => {
    it('should throw an error if the environment is not initialized', () => {
      const sutInstance = new Environment();

      expect(() => sutInstance.has('redis')).toThrowError(
        'Environment is not initialized'
      );
    });

    it('should return the value of the key', () => {
      const sutInstance = new Environment<TestEnvironment>();
      sutInstance['isInitialized'] = true;

      const mockValue = true;

      (
        Getter.hasKeyValue as jest.MockedFunction<() => unknown>
      ).mockReturnValueOnce(mockValue);

      const sutResult = sutInstance.has('redis');

      expect(sutResult).toBe(mockValue);
    });
  });
});
