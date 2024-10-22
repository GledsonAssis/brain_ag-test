import Cpf from "@/domain/vo/cpf";

describe("Cpf", () => {
  it("should create a valid CPF", () => {
    const validCpf = "123.456.789-09";
    const cpfInstance = new Cpf(validCpf);
    expect(cpfInstance.getValue()).toBe(validCpf);
  });

  it("should throw an error when CPF is invalid", () => {
    const invalidCpf = "123.456.789-00";
    expect(() => new Cpf(invalidCpf)).toThrow("Invalid cpf");
  });

  it("should allow creation of an empty CPF", () => {
    const cpfInstance = new Cpf("");
    expect(cpfInstance.getValue()).toBe("");
  });

  it("should return false for invalid CPF length", () => {
    const cpfInstance = new Cpf();
    const invalidCpf = "123";
    expect(cpfInstance.validate(invalidCpf)).toBe(false);
  });

  it("should return false if all digits of CPF are the same", () => {
    const cpfInstance = new Cpf();
    const invalidCpf = "111.111.111-11";
    expect(cpfInstance.validate(invalidCpf)).toBe(false);
  });

  it("should validate a correct CPF", () => {
    const cpfInstance = new Cpf();
    const validCpf = "123.456.789-09"; // CPF should be valid for this example
    expect(cpfInstance.validate(validCpf)).toBe(true);
  });

  it("should return false for a CPF with incorrect check digits", () => {
    const cpfInstance = new Cpf();
    const invalidCpf = "123.456.789-12"; // CPF with incorrect check digits
    expect(cpfInstance.validate(invalidCpf)).toBe(false);
  });

  it("should calculate the first digit correctly", () => {
    const cpfInstance = new Cpf();
    const validCpf = "123456789";
    const firstDigit = cpfInstance.calculateDigit(validCpf, cpfInstance.FIRST_DIGIT_FACTOR);
    expect(firstDigit).toBe(0); // Replace with expected first digit for this CPF
  });

  it("should calculate the second digit correctly", () => {
    const cpfInstance = new Cpf();
    const validCpf = "123456789";
    const secondDigit = cpfInstance.calculateDigit(validCpf, cpfInstance.SECOND_DIGIT_FACTOR);
    expect(secondDigit).toBe(9); // Replace with expected second digit for this CPF
  });

  it("should extract the check digits correctly", () => {
    const cpfInstance = new Cpf();
    const validCpf = "123.456.789-09";
    const extractedDigits = cpfInstance.extractDigit(validCpf.replace(/\D/g, ""));
    expect(extractedDigits).toBe("09");
  });

  it("should return true for a CPF with valid check digits", () => {
    const validCpf = "123.456.789-09";
    const cpfInstance = new Cpf(validCpf);
    expect(cpfInstance.validate(validCpf)).toBe(true);
  });
});
