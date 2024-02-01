import { describe, it, expect, beforeAll } from '@jest/globals';

import Validator from '../../src/lifecycle/Validator';
import { IVariableDescription } from '../../src/utils/types';
import { testParsedEnvDescription } from './testParsedEnvDescription';

describe('Validator', () => {
  beforeAll(() => {
    // unset test environment
    process.env['APPLICATION_NAME'] = undefined;
    process.env['PORT'] = undefined;
    process.env['LOG_LEVEL'] = undefined;
    process.env['REDIS_HOST'] = undefined;
    process.env['REDIS_PORT'] = undefined;
    process.env['REDIS_USERNAME'] = undefined;
    process.env['REDIS_PASSWORD'] = undefined;
    process.env['REDIS_INDEXES'] = undefined;
    process.env['PROMETHEUS_ENABLED'] = undefined;
    process.env['PROMETHEUS_HOST'] = undefined;
    process.env['PROMETHEUS_PORT'] = undefined;
    process.env['PROMETHEUS_DEFAULT_QUANTILES'] = undefined;
    process.env['SECRET_EXPIRE_AT'] = undefined;
  });

  describe('validateEnvironment', () => {
    it('should validate the set environment variable according to the parsed env description rules and throw errors whenever an invalid/missing variable is encountered', () => {
      expect(() => {
        Validator.validateEnvironment(
          <IVariableDescription[]>testParsedEnvDescription
        );
      }).toThrowError('Environment variable APPLICATION_NAME is required');

      process.env['APPLICATION_NAME'] = 'MyTestApp';

      expect(() => {
        Validator.validateEnvironment(
          <IVariableDescription[]>testParsedEnvDescription
        );
      }).toThrowError('Environment variable PORT is required');

      process.env['PORT'] = 'ABC';

      expect(() => {
        Validator.validateEnvironment(
          <IVariableDescription[]>testParsedEnvDescription
        );
      }).toThrowError('Environment variable PORT must be a castable number');

      process.env['PORT'] = '3000';

      expect(() => {
        Validator.validateEnvironment(
          <IVariableDescription[]>testParsedEnvDescription
        );
      }).toThrowError('Environment variable LOG_LEVEL is required');

      process.env['LOG_LEVEL'] = 'butterfly';

      expect(() => {
        Validator.validateEnvironment(
          <IVariableDescription[]>testParsedEnvDescription
        );
      }).toThrowError(
        'Environment variable LOG_LEVEL must be one of [debug,info,warn,error]'
      );

      process.env['LOG_LEVEL'] = 'debug';

      expect(() => {
        Validator.validateEnvironment(
          <IVariableDescription[]>testParsedEnvDescription
        );
      }).toThrowError('Environment variable REDIS_HOST is required');

      process.env['REDIS_HOST'] = 'localhost';

      expect(() => {
        Validator.validateEnvironment(
          <IVariableDescription[]>testParsedEnvDescription
        );
      }).toThrowError('Environment variable REDIS_PORT is required');

      process.env['REDIS_PORT'] = 'ABC';

      expect(() => {
        Validator.validateEnvironment(
          <IVariableDescription[]>testParsedEnvDescription
        );
      }).toThrowError(
        'Environment variable REDIS_PORT must be a castable number'
      );

      process.env['REDIS_PORT'] = '6379';

      expect(() => {
        Validator.validateEnvironment(
          <IVariableDescription[]>testParsedEnvDescription
        );
      }).toThrowError('Environment variable REDIS_USERNAME is required');

      process.env['REDIS_USERNAME'] = 'user';

      expect(() => {
        Validator.validateEnvironment(
          <IVariableDescription[]>testParsedEnvDescription
        );
      }).toThrowError('Environment variable REDIS_PASSWORD is required');

      process.env['REDIS_PASSWORD'] = 'password';

      expect(() => {
        Validator.validateEnvironment(
          <IVariableDescription[]>testParsedEnvDescription
        );
      }).toThrowError('Environment variable REDIS_INDEXES is required');

      process.env['REDIS_INDEXES'] = 'abc, def, ghi';

      expect(() => {
        Validator.validateEnvironment(
          <IVariableDescription[]>testParsedEnvDescription
        );
      }).toThrowError('Environment variable PROMETHEUS_ENABLED is required');

      process.env['PROMETHEUS_ENABLED'] = 'ABC';

      expect(() => {
        Validator.validateEnvironment(
          <IVariableDescription[]>testParsedEnvDescription
        );
      }).toThrowError(
        'Environment variable PROMETHEUS_ENABLED must be a castable boolean'
      );

      process.env['PROMETHEUS_ENABLED'] = 'true';

      expect(() => {
        Validator.validateEnvironment(
          <IVariableDescription[]>testParsedEnvDescription
        );
      }).toThrowError('Environment variable PROMETHEUS_HOST is required');

      process.env['PROMETHEUS_HOST'] = 'localhost';

      expect(() => {
        Validator.validateEnvironment(
          <IVariableDescription[]>testParsedEnvDescription
        );
      }).toThrowError('Environment variable PROMETHEUS_PORT is required');

      process.env['PROMETHEUS_PORT'] = 'ABC';

      expect(() => {
        Validator.validateEnvironment(
          <IVariableDescription[]>testParsedEnvDescription
        );
      }).toThrowError(
        'Environment variable PROMETHEUS_PORT must be a castable number'
      );

      process.env['PROMETHEUS_PORT'] = '9090';
      process.env['PROMETHEUS_DEFAULT_QUANTILES'] = 'ABC, DEF';

      expect(() => {
        Validator.validateEnvironment(
          <IVariableDescription[]>testParsedEnvDescription
        );
      }).toThrowError(
        'Environment variable PROMETHEUS_DEFAULT_QUANTILES must be a castable array of numbers'
      );

      process.env['PROMETHEUS_DEFAULT_QUANTILES'] = '0.5, 0.9, 0.99';

      expect(() => {
        Validator.validateEnvironment(
          <IVariableDescription[]>testParsedEnvDescription
        );
      }).toThrowError('Environment variable SECRET_EXPIRE_AT is required');

      process.env['SECRET_EXPIRE_AT'] = 'ABCDEF';

      expect(() => {
        Validator.validateEnvironment(
          <IVariableDescription[]>testParsedEnvDescription
        );
      }).toThrowError(
        'Environment variable SECRET_EXPIRE_AT must be a castable date'
      );

      process.env['SECRET_EXPIRE_AT'] = '2021-12-31';

      expect(() => {
        Validator.validateEnvironment(
          <IVariableDescription[]>testParsedEnvDescription
        );
      }).not.toThrow();
    });
  });
});
