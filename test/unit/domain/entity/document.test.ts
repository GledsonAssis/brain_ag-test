import Document from "@/domain/entity/document";
import Cpf from "@/domain/vo/cpf";
import Cnpj from "@/domain/vo/cnpj";

jest.mock("@/domain/vo/cpf");
jest.mock("@/domain/vo/cnpj");

describe("Document", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should define document as CPF when valid CPF is provided", () => {
    const mockCpf = Cpf.prototype.validate as jest.Mock;
    mockCpf.mockReturnValue(true);
    const mockCnpj = Cnpj.prototype.validate as jest.Mock;
    mockCnpj.mockReturnValue(false);

    const validCpf = "012.345.678-90";
    const documentInstance = new Document(validCpf);
    
    expect(mockCpf).toHaveBeenCalledWith(validCpf);
    expect(mockCnpj).not.toHaveBeenCalled();
    expect(documentInstance.getValue()).toBe(validCpf);
  });

  it("should define document as CNPJ when valid CNPJ is provided", () => {
    const mockCpf = Cpf.prototype.validate as jest.Mock;
    mockCpf.mockReturnValue(false);
    const mockCnpj = Cnpj.prototype.validate as jest.Mock;
    mockCnpj.mockReturnValue(true);

    const validCnpj = "12.345.678/0001-95";
    const documentInstance = new Document(validCnpj);
    
    expect(mockCpf).toHaveBeenCalledWith(validCnpj);
    expect(mockCnpj).toHaveBeenCalledWith(validCnpj);
    expect(documentInstance.getValue()).toBe(validCnpj);
  });

  it("should throw an error when both CPF and CNPJ are invalid", () => {
    const mockCpf = Cpf.prototype.validate as jest.Mock;
    mockCpf.mockReturnValue(false);
    const mockCnpj = Cnpj.prototype.validate as jest.Mock;
    mockCnpj.mockReturnValue(false);

    const invalidDocument = "123";

    expect(() => new Document(invalidDocument)).toThrow("Invalid Document");
    expect(mockCpf).toHaveBeenCalledWith(invalidDocument);
    expect(mockCnpj).toHaveBeenCalledWith(invalidDocument);
  });

  it("should not validate CNPJ if CPF is valid", () => {
    const mockCpf = Cpf.prototype.validate as jest.Mock;
    mockCpf.mockReturnValue(true);
    const mockCnpj = Cnpj.prototype.validate as jest.Mock;

    const validCpf = "123.456.789-09";
    const documentInstance = new Document(validCpf);
    
    expect(mockCpf).toHaveBeenCalledWith(validCpf);
    expect(mockCnpj).not.toHaveBeenCalled();
    expect(documentInstance.getValue()).toBe(validCpf);
  });

  it("should not validate CPF if CNPJ is valid", () => {
    const mockCpf = Cpf.prototype.validate as jest.Mock;
    mockCpf.mockReturnValue(false);
    const mockCnpj = Cnpj.prototype.validate as jest.Mock;
    mockCnpj.mockReturnValue(true);

    const validCnpj = "12.345.678/0001-95";
    const documentInstance = new Document(validCnpj);
    
    expect(mockCpf).toHaveBeenCalledWith(validCnpj);
    expect(mockCnpj).toHaveBeenCalledWith(validCnpj);
    expect(documentInstance.getValue()).toBe(validCnpj);
  });
});
