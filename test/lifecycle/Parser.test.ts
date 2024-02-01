import { describe, it, expect } from '@jest/globals';

import Parser from '../../src/lifecycle/Parser';
import type { ITypeDescription } from 'tparserr';

import testEnvJson from '../testEnv.json';
import { testParsedEnvDescription } from './testParsedEnvDescription';

describe('Parser', () => {
  describe('parseEnvDescription', () => {
    it('should parse the input type descriptions into env variable descriptions', () => {
      const parsedOutput = Parser.parseEnvDescription(
        <ITypeDescription>testEnvJson[0]
      );

      expect(parsedOutput).toEqual(testParsedEnvDescription);
    });
  });
});
