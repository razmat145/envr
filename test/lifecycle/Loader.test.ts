import { describe, it, expect, beforeAll } from '@jest/globals';

import Loader from '../../src/lifecycle/Loader';

import { testParsedEnvDescription } from './testParsedEnvDescription';
import { IVariableDescription } from '../../src/utils/types';

describe('Loader', () => {
  beforeAll(() => {
    // set test environment
    process.env['APPLICATION_NAME'] = 'MyTestApp';
    process.env['PORT'] = '3000';
    process.env['LOG_LEVEL'] = 'info';
    process.env['REDIS_HOST'] = 'localhost';
    process.env['REDIS_PORT'] = '6379';
    process.env['REDIS_USERNAME'] = 'user';
    process.env['REDIS_PASSWORD'] = 'password';
    process.env['REDIS_INDEXES'] = 'abc, def, ghi';
    process.env['PROMETHEUS_ENABLED'] = 'true';
    process.env['PROMETHEUS_HOST'] = 'localhost';
    process.env['PROMETHEUS_PORT'] = '9090';
    process.env['PROMETHEUS_DEFAULT_QUANTILES'] = '0.5, 0.9, 0.99';
    process.env['SECRET_EXPIRE_AT'] = '2021-12-31';
  });

  describe('loadEnvVariables', () => {
    it('should load the environment variables', () => {
      const sutResult = Loader.loadEnvVariables(
        <IVariableDescription[]>testParsedEnvDescription
      );

      expect(sutResult).toEqual({
        applicationName: 'MyTestApp',
        port: 3000,
        logLevel: 'info',
        redis: {
          host: 'localhost',
          port: 6379,
          username: 'user',
          password: 'password',
          indexes: ['abc', 'def', 'ghi'],
        },
        prometheus: {
          enabled: true,
          host: 'localhost',
          port: 9090,
          defaultQuantiles: [0.5, 0.9, 0.99],
          flags: {
            enabledEndpoints: null,
            enabledUserIds: null,
          },
        },
        secretExpireAt: new Date('2021-12-31'),
      });
    });
  });
});
