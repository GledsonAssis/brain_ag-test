import Cnpj from "@/domain/vo/cnpj";

describe("Cnpj", () => {
  it("should create a valid CNPJ", () => {
    const validCnpj = "12.345.678/0001-95";
    const cnpjInstance = new Cnpj(validCnpj);
    expect(cnpjInstance.getValue()).toBe(validCnpj);
  });

  it("should throw an error when CNPJ is invalid", () => {
    const invalidCnpj = "12.345.678/0001-00";
    expect(() => new Cnpj(invalidCnpj)).toThrow("Invalid CNPJ");
  });

  it("should allow creation of an empty CNPJ", () => {
    const cnpjInstance = new Cnpj("");
    expect(cnpjInstance.getValue()).toBe("");
  });

  it("should return false for invalid CNPJ length", () => {
    const cnpjInstance = new Cnpj();
    const invalidCnpj = "123";
    expect(cnpjInstance.validate(invalidCnpj)).toBe(false);
  });

  it("should return false if all digits of CNPJ are the same", () => {
    const cnpjInstance = new Cnpj();
    const invalidCnpj = "11.111.111/1111-11";
    expect(cnpjInstance.validate(invalidCnpj)).toBe(false);
  });

  it("should return false with invalid CNPJ", () => {
    const cnpjInstance = new Cnpj();
    const invalidCnpj = "12.345.678/0000-00";
    expect(cnpjInstance.validate(invalidCnpj)).toBe(false);
  });

  it("should validate a correct CNPJ", () => {
    const cnpjInstance = new Cnpj();
    const validCnpj = "12.345.678/0001-95";
    expect(cnpjInstance.validate(validCnpj)).toBe(true);
  });

  it("should return false for a CNPJ with incorrect check digits", () => {
    const cnpjInstance = new Cnpj();
    const invalidCnpj = "12.345.678/0001-00";
    expect(cnpjInstance.validate(invalidCnpj)).toBe(false);
  });

  it("should calculate the first digit correctly", () => {
    const cnpjInstance = new Cnpj();
    const validCnpj = "123456780001";
    const firstDigit = cnpjInstance.calculateDigit(validCnpj, cnpjInstance.FIRST_DIGIT_FACTOR);
    expect(firstDigit).toBe(9);
  });

  it("should calculate the second digit correctly", () => {
    const cnpjInstance = new Cnpj();
    const validCnpj = "1234567800019";
    const secondDigit = cnpjInstance.calculateDigit(validCnpj, cnpjInstance.SECOND_DIGIT_FACTOR);
    expect(secondDigit).toBe(5);
  });

  it("should extract the check digits correctly", () => {
    const cnpjInstance = new Cnpj();
    const validCnpj = "12.345.678/0001-95";
    const extractedDigits = cnpjInstance.extractDigits(validCnpj.replace(/\D/g, ""));
    expect(extractedDigits).toBe("95");
  });

  it("should return true for a CNPJ with valid check digits", () => {
    const validCnpj = "12.345.678/0001-95";
    const cnpjInstance = new Cnpj(validCnpj);
    expect(cnpjInstance.validate(validCnpj)).toBe(true);
  });
});
