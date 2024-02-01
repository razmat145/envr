import { describe, it, expect } from '@jest/globals';

import Getter from '../../src/lifecycle/Getter';

describe('Getter', () => {
  describe('getKeyValue', () => {
    it('should return the value of the key', () => {
      const mockEnv = { key: 'value' };

      expect(Getter.getKeyValue(mockEnv, 'key')).toBe('value');
    });

    it('should return null if the key is not found', () => {
      const mockEnv: { key: string; otherKey?: string } = { key: 'value' };

      expect(Getter.getKeyValue(mockEnv, 'otherKey')).toBe(null);
    });
  });

  describe('hasKeyValue', () => {
    it('should return true if the key is found', () => {
      const mockEnv = { key: 'value' };

      expect(Getter.hasKeyValue(mockEnv, 'key')).toBe(true);
    });

    it('should return false if the key is not found', () => {
      const mockEnv = { key: 'value' };

      expect(Getter.hasKeyValue(mockEnv, 'otherKey')).toBe(false);
    });
  });
});
