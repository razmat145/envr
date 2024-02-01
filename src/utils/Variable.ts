class Variable {
  public isNumber(value: string): boolean {
    return !isNaN(Number(value));
  }

  public isArrayOfNumbers(value: string): boolean {
    const array = value.split(',');

    return array.every((element) => this.isNumber(element));
  }

  public isPartOfStringEnum(value: string, enumDef: string[]): boolean {
    return enumDef.includes(this.extractString(value));
  }

  public isPartOfNumberEnum(value: string, enumDef: number[]): boolean {
    return enumDef.includes(Number(this.extractString(value)));
  }

  public isBoolean(value: string): boolean {
    return (
      this.extractString(value) === 'true' ||
      this.extractString(value) === 'false'
    );
  }

  public isDate(value: string): boolean {
    return (
      !this.isNumber(value) && !isNaN(Date.parse(this.extractString(value)))
    );
  }

  public isCronString(value: string): boolean {
    const fields = value.split(' ');

    if (fields.length !== 5 && fields.length !== 6) {
      return false;
    }

    const ranges = [
      [0, 59],
      [0, 59],
      [0, 23],
      [1, 31],
      [1, 12],
      [0, 7],
    ];

    if (fields.length === 5) {
      ranges.shift();
    }

    for (let i = 0; i < fields.length; i++) {
      const hasCronRange = fields[i].includes('-');
      const hasCronStep = fields[i].includes('/');
      const isCronWildcard = fields[i] === '*';

      switch (true) {
        case hasCronRange:
          const [start, end] = fields[i]
            .split('-')
            .map((f) => this.extractNumber(f));

          if (!(start >= ranges[i][0] && end <= ranges[i][1] && start < end)) {
            return false;
          }
          break;

        case hasCronStep:
          const parts = fields[i].split('/');
          const step = this.extractNumber(parts[1]);

          if (
            parts[0] !== '*' &&
            !(
              this.extractNumber(parts[0]) >= ranges[i][0] &&
              this.extractNumber(parts[0]) <= ranges[i][1] &&
              step > 0 &&
              step <= ranges[i][1]
            )
          ) {
            return false;
          }
          break;

        case !isCronWildcard:
          const value = this.extractNumber(fields[i]);

          if (!(value >= ranges[i][0] && value <= ranges[i][1])) {
            return false;
          }
          break;
      }
    }

    return true;
  }

  public extractString(value: string): string {
    return value.trim();
  }

  public extractNumber(value: string): number {
    return Number(this.extractString(value));
  }

  public extractBoolean(value: string): boolean {
    return this.extractString(value) === 'true';
  }

  public extractArrayOfStrings(value: string): string[] {
    return value.split(',').map((element) => element.trim());
  }

  public extractArrayOfNumbers(value: string): number[] {
    return value.split(',').map((element) => Number(element.trim()));
  }

  public extractDate(value: string): Date {
    return new Date(this.extractString(value));
  }
}

export default new Variable();
