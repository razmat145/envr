import { describe, it, expect } from '@jest/globals';

import Variable from '../../src/utils/Variable';

describe('Variable', () => {
  describe('isNumber', () => {
    it('should return true if the value is a number', () => {
      expect(Variable.isNumber('1')).toBe(true);
      expect(Variable.isNumber('0')).toBe(true);
      expect(Variable.isNumber('-1')).toBe(true);
      expect(Variable.isNumber('1.1')).toBe(true);
      expect(Variable.isNumber('0.0')).toBe(true);
      expect(Variable.isNumber('-1.1')).toBe(true);
    });

    it('should return false if the value is not a number', () => {
      expect(Variable.isNumber('a')).toBe(false);
      expect(Variable.isNumber('1a')).toBe(false);
      expect(Variable.isNumber('a1')).toBe(false);
      expect(Variable.isNumber('1.a')).toBe(false);
      expect(Variable.isNumber('1.1.1')).toBe(false);
      expect(Variable.isNumber('1.1a')).toBe(false);
      expect(Variable.isNumber('1.a1')).toBe(false);
      expect(Variable.isNumber('a.1')).toBe(false);
      expect(Variable.isNumber('a1.1')).toBe(false);
    });
  });

  describe('isArrayOfNumbers', () => {
    it('should return true if the value is an array of numbers', () => {
      expect(Variable.isArrayOfNumbers('1')).toBe(true);
      expect(Variable.isArrayOfNumbers('1,2')).toBe(true);
      expect(Variable.isArrayOfNumbers('1,2,3')).toBe(true);
      expect(Variable.isArrayOfNumbers('1.1')).toBe(true);
      expect(Variable.isArrayOfNumbers('1.1,2.2')).toBe(true);
      expect(Variable.isArrayOfNumbers('1.1,2.2,3.3')).toBe(true);
    });

    it('should return false if the value is not an array of numbers', () => {
      expect(Variable.isArrayOfNumbers('a')).toBe(false);
      expect(Variable.isArrayOfNumbers('1a')).toBe(false);
      expect(Variable.isArrayOfNumbers('a1')).toBe(false);
      expect(Variable.isArrayOfNumbers('1.a')).toBe(false);
      expect(Variable.isArrayOfNumbers('1.1.1')).toBe(false);
      expect(Variable.isArrayOfNumbers('1.1a')).toBe(false);
      expect(Variable.isArrayOfNumbers('1.a1')).toBe(false);
      expect(Variable.isArrayOfNumbers('a.1')).toBe(false);
      expect(Variable.isArrayOfNumbers('a1.1')).toBe(false);
    });
  });

  describe('isPartOfStringEnum', () => {
    it('should return true if the value is part of the enum', () => {
      expect(Variable.isPartOfStringEnum('a', ['a', 'b', 'c'])).toBe(true);
      expect(Variable.isPartOfStringEnum('b', ['a', 'b', 'c'])).toBe(true);
      expect(Variable.isPartOfStringEnum('c', ['a', 'b', 'c'])).toBe(true);
    });

    it('should return false if the value is not part of the enum', () => {
      expect(Variable.isPartOfStringEnum('d', ['a', 'b', 'c'])).toBe(false);
      expect(Variable.isPartOfStringEnum('e', ['a', 'b', 'c'])).toBe(false);
      expect(Variable.isPartOfStringEnum('f', ['a', 'b', 'c'])).toBe(false);
    });
  });

  describe('isPartOfNumberEnum', () => {
    it('should return true if the value is part of the enum', () => {
      expect(Variable.isPartOfNumberEnum('1', [1, 2, 3])).toBe(true);
      expect(Variable.isPartOfNumberEnum('2', [1, 2, 3])).toBe(true);
      expect(Variable.isPartOfNumberEnum('3', [1, 2, 3])).toBe(true);
    });

    it('should return false if the value is not part of the enum', () => {
      expect(Variable.isPartOfNumberEnum('4', [1, 2, 3])).toBe(false);
      expect(Variable.isPartOfNumberEnum('5', [1, 2, 3])).toBe(false);
      expect(Variable.isPartOfNumberEnum('6', [1, 2, 3])).toBe(false);
    });
  });

  describe('isBoolean', () => {
    it('should return true if the value is a boolean', () => {
      expect(Variable.isBoolean('true')).toBe(true);
      expect(Variable.isBoolean('false')).toBe(true);
    });

    it('should return false if the value is not a boolean', () => {
      expect(Variable.isBoolean('a')).toBe(false);
      expect(Variable.isBoolean('1')).toBe(false);
      expect(Variable.isBoolean('0')).toBe(false);
      expect(Variable.isBoolean('1.1')).toBe(false);
      expect(Variable.isBoolean('0.0')).toBe(false);
      expect(Variable.isBoolean('-1.1')).toBe(false);
    });
  });

  describe('isDate', () => {
    it('should return true if the value is a date', () => {
      expect(Variable.isDate('2021-01-01')).toBe(true);
      expect(Variable.isDate('2021-01-01 00:00:00')).toBe(true);
      expect(Variable.isDate('2021-01-01T00:00:00')).toBe(true);
      expect(Variable.isDate('2021-01-01T00:00:00.000Z')).toBe(true);
    });

    it('should return false if the value is not a date', () => {
      expect(Variable.isDate('a')).toBe(false);
      expect(Variable.isDate('-1.1')).toBe(false);
      expect(Variable.isDate('2021-01-01TAB:CD:00.000Z')).toBe(false);
      expect(Variable.isDate('9999995412624')).toBe(false);
      expect(Variable.isDate('9999995412624.000Z')).toBe(false);
      expect(Variable.isDate('9999995412624.000')).toBe(false);
    });
  });

  describe('extractString', () => {
    it('should return the string', () => {
      expect(Variable.extractString('a')).toBe('a');
      expect(Variable.extractString('a ')).toBe('a');
      expect(Variable.extractString(' a')).toBe('a');
      expect(Variable.extractString(' a ')).toBe('a');
    });
  });

  describe('extractNumber', () => {
    it('should return the number', () => {
      expect(Variable.extractNumber('1')).toBe(1);
      expect(Variable.extractNumber('1 ')).toBe(1);
      expect(Variable.extractNumber(' 1')).toBe(1);
      expect(Variable.extractNumber(' 1 ')).toBe(1);
    });
  });

  describe('extractBoolean', () => {
    it('should return the boolean', () => {
      expect(Variable.extractBoolean('true')).toBe(true);
      expect(Variable.extractBoolean('true ')).toBe(true);
      expect(Variable.extractBoolean(' true')).toBe(true);
      expect(Variable.extractBoolean(' true ')).toBe(true);
    });
  });

  describe('extractArrayOfStrings', () => {
    it('should return the array of strings', () => {
      expect(Variable.extractArrayOfStrings('a')).toEqual(['a']);
      expect(Variable.extractArrayOfStrings('a,b')).toEqual(['a', 'b']);
      expect(Variable.extractArrayOfStrings('a,b,c')).toEqual(['a', 'b', 'c']);
      expect(Variable.extractArrayOfStrings('a, b, c')).toEqual([
        'a',
        'b',
        'c',
      ]);
      expect(Variable.extractArrayOfStrings('a , b , c')).toEqual([
        'a',
        'b',
        'c',
      ]);
      expect(Variable.extractArrayOfStrings('a ,b ,c')).toEqual([
        'a',
        'b',
        'c',
      ]);
    });
  });

  describe('extractArrayOfNumbers', () => {
    it('should return the array of numbers', () => {
      expect(Variable.extractArrayOfNumbers('1')).toEqual([1]);
      expect(Variable.extractArrayOfNumbers('1,2')).toEqual([1, 2]);
      expect(Variable.extractArrayOfNumbers('1,2,3')).toEqual([1, 2, 3]);
      expect(Variable.extractArrayOfNumbers('1, 2, 3')).toEqual([1, 2, 3]);
      expect(Variable.extractArrayOfNumbers('1 , 2 , 3')).toEqual([1, 2, 3]);
      expect(Variable.extractArrayOfNumbers('1 ,2 ,3')).toEqual([1, 2, 3]);
    });
  });

  describe('extractDate', () => {
    it('should return the date', () => {
      expect(Variable.extractDate('2021-01-01')).toEqual(
        new Date('2021-01-01')
      );
      expect(Variable.extractDate('2021-01-01 00:00:00')).toEqual(
        new Date('2021-01-01 00:00:00')
      );
      expect(Variable.extractDate('2021-01-01T00:00:00')).toEqual(
        new Date('2021-01-01T00:00:00')
      );
      expect(Variable.extractDate('2021-01-01T00:00:00.000Z')).toEqual(
        new Date('2021-01-01T00:00:00.000Z')
      );
    });
  });
});
