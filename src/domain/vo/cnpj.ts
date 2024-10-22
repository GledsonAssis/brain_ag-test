export default class Cnpj {
  static readonly CNPJ_VALID_LENGTH = 14;
  readonly FIRST_DIGIT_FACTOR = 5;
  readonly SECOND_DIGIT_FACTOR = 6;

  readonly value: string;

  constructor(value: string = "") {
    if (value && !this.validate(value)) throw new Error("Invalid CNPJ");
    this.value = value;
  }

  validate(cnpj: string): boolean {
    const cleanedCnpj = cnpj.replace(/\D/g, "");
    if (cleanedCnpj.length !== Cnpj.CNPJ_VALID_LENGTH) return false;
    if (this.allDigitsTheSame(cleanedCnpj)) return false;

    const digit1 = this.calculateDigit(
      cleanedCnpj.slice(0, 12),
      this.FIRST_DIGIT_FACTOR
    );
    const digit2 = this.calculateDigit(
      cleanedCnpj.slice(0, 13),
      this.SECOND_DIGIT_FACTOR
    );

    return `${digit1}${digit2}` === this.extractDigits(cleanedCnpj);
  }

  allDigitsTheSame(cnpj: string): boolean {
    const [firstDigit] = cnpj;
    return [...cnpj].every((digit) => digit === firstDigit);
  }

  calculateDigit(cnpj: string, factor: number): number {
    let total = 0;
    for (const digit of cnpj) {
      total += parseInt(digit) * factor;
      factor = factor === 2 ? 9 : factor - 1;
    }
    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }

  extractDigits(cnpj: string): string {
    return cnpj.slice(-2);
  }

  public getValue(): string {
    return this.value;
  }
}
