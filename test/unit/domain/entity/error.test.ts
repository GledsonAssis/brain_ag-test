import CustomError, { ErrorCodes } from "@/domain/entity/error";

describe("CustomError", () => {
  it("should instantiate CustomError with an error object and a status code", () => {
    const error = { code: ErrorCodes.INVALID_PARAMS };
    const statusCode = 400;
    const customError = new CustomError(error);

    expect(customError).toBeInstanceOf(CustomError);
    expect(customError).toBeInstanceOf(Error);
    expect(customError.name).toBe("Error");
    expect(customError.message).toBe(JSON.stringify(error));
    expect(customError.code).toBe("INVALID_PARAMS");
    expect(customError.statusCode).toBe(statusCode);
  });

  it("should inherit from the Error class and have access to its properties and methods", () => {
    const error = { code: ErrorCodes.UNMAPPED_ERROR };
    const customError = new CustomError(error as any);

    expect(customError).toBeInstanceOf(CustomError);
    expect(customError).toBeInstanceOf(Error);
    expect(customError.name).toBe("Error");
    expect(customError.message).toBe(JSON.stringify(error));
    expect(customError.code).toBe("UNMAPPED_ERROR");
    expect(customError.statusCode).toBe(500);
    expect(customError.stack).toBeDefined();
  });

  it("should set its own name, message, code, and statusCode properties based on the input", () => {
    const error = { code: ErrorCodes.INVALID_PARAMS };
    const statusCode = 400;
    const customError = new CustomError(error as any);

    expect(customError.name).toBe("Error");
    expect(customError.message).toBe(JSON.stringify(error));
    expect(customError.code).toBe("INVALID_PARAMS");
    expect(customError.statusCode).toBe(statusCode);
  });

  it("should instantiate CustomError without a status code and default to 500", () => {
    const error = { code: ErrorCodes.SERVER_ERROR };
    const customError = new CustomError(error as any);

    expect(customError.statusCode).toBe(500);
  });

  it("should instantiate CustomError without an error object and have empty message and code properties", () => {
    const customError = new CustomError({} as any);

    expect(customError.message).toBe("{}");
    expect(customError.code).toBe("UNMAPPED_ERROR");
  });

  it("should handle circular references in the input error object for the message property", () => {
    const error: any = { code: "123" };
    error.circular = error;
    const customError = new CustomError(error);

    expect(customError.message).toBe(
      JSON.stringify({ code: "123", circular: "[Circular]" })
    );
  });
});
