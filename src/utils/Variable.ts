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
