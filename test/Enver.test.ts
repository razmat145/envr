import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  beforeAll,
} from '@jest/globals';

jest.mock('../src/Environment');

import { Enver } from '../src/Enver';
import { Environment } from '../src/Environment';

import { Environment as TestEnvironment } from './testEnv';
import { IEnverConfig } from '../src/utils/types';

describe('Enver', () => {
  beforeAll(() => {
    // fake destruct
    Enver['instance'] = <any>undefined;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockOpts = <IEnverConfig>{ data: 'here' };

  it('should throw an error if the environment is not initialized', () => {
    expect(() => Enver.getEnv()).toThrowError('Environment is not initialized');

    expect(() =>
      Enver.get<TestEnvironment, 'logLevel'>('logLevel')
    ).toThrowError('Environment is not initialized');

    expect(() => Enver.has('redis')).toThrowError(
      'Environment is not initialized'
    );
  });

  it('should instantiate and initialise the environment', async () => {
    // being a singleton this instantiates it for the other tests
    await Enver.initialize(mockOpts);

    expect(Environment).toHaveBeenCalledTimes(1);
    expect(Environment).toHaveBeenCalledWith(mockOpts);

    expect(Environment.prototype.initialize).toHaveBeenCalledTimes(1);

    expect(Enver['instance']['environment']).toBeInstanceOf(Environment);
  });

  it('should return the environment and its values once initialised', async () => {
    // getEnv
    const mockEnv = { applicationName: 'test' };

    (Environment.prototype.getEnv as jest.Mock).mockReturnValueOnce(mockEnv);

    const sutEnvResult = Enver.getEnv();

    expect(sutEnvResult).toBe(mockEnv);

    // get
    const mockValue = 'debug';

    (Environment.prototype.get as jest.Mock).mockReturnValueOnce(mockValue);

    const sutGetResult = Enver.get<TestEnvironment, 'logLevel'>('logLevel');

    expect(sutGetResult).toBe(mockValue);

    // has
    (Environment.prototype.has as jest.Mock).mockReturnValueOnce(true);

    const sutHasResult = Enver.has('redis');

    expect(sutHasResult).toBe(true);
  });
});
