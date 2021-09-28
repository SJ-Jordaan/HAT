export class RegexValidator {
  private static numericalValue = /\d+/g;
  private static lineWithStateName = /-- State \d+ --/;
  private static lineWithAgentName = /Agent a\d+/;
  private static lineWithTransition = /\d+ -> \d+/;
  private static emptyLine = /^\s*$/;
  private static comment = /\/{2}/;

  public static extractNumericalValue(line: string): string {
    return line?.match?.(this.numericalValue)?.[0] || '';
  }

  public static extractTransition(line: string): string[][] {
    const transitions = line?.match?.(this.numericalValue)?.slice?.(0, 2) || [];
    const actions =
      line
        ?.split('[')?.[1]
        ?.match?.(/\<(.*?)\>/)?.[1]
        ?.split?.(';') || [];
    return [transitions, actions];
  }

  public static isComment(line: string): boolean {
    return this.comment.test(line);
  }

  public static isStateName(line: string): boolean {
    return this.lineWithStateName.test(line);
  }

  public static isAgentName(line: string): boolean {
    return this.lineWithAgentName.test(line);
  }

  public static isTransition(line: string): boolean {
    return this.lineWithTransition.test(line);
  }

  public static isEmptyLine(line: string): boolean {
    return this.emptyLine.test(line);
  }
}
