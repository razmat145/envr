class Getter {
  public hasKeyValue<T extends Object>(obj: T, path: string): boolean {
    return this.getKeyValue(obj, <keyof T>path) !== null;
  }

  public getKeyValue<T extends Object, K extends keyof T = keyof T>(
    obj: T,
    path: K
  ): T[K] {
    const keys = (<string>path).split('.');

    let currentNesting = obj;
    while (keys.length > 1) {
      const currentNestingLevel = keys.shift();

      if (!(currentNestingLevel in obj)) {
        return null;
      }

      currentNesting = obj[currentNestingLevel];
    }

    return currentNesting[keys.shift()] || null;
  }
}

export default new Getter();
