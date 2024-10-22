import { CreateProducer } from "@/application/usecases";
import { HttpRequest, HttpResponse } from "@/interfaces/presentations";
import { Logger } from "@/infra/logger";
import { AJVCompile as InputValidator } from "@/infra/input-validator";
import { CreateProducerController } from "@/interfaces/controllers";
import CustomError, { ErrorCodes } from "@/domain/entity/error";

jest.mock("@/application/usecases", () => {
  return {
    CreateProducer: jest.fn().mockImplementation(() => ({
      execute: jest.fn(),
    })),
  };
});

jest.mock("@/infra/logger");
jest.mock("@/infra/input-validator");

describe("CreateProducerController", () => {
  let createProducerController: CreateProducerController;
  let mockUsecase: jest.Mocked<CreateProducer>;
  let mockInputValidator: jest.Mocked<InputValidator>;

  beforeEach(() => {
    mockUsecase = new (require("@/application/usecases").CreateProducer)();

    createProducerController = new CreateProducerController();
    createProducerController.usecase = mockUsecase;

    mockInputValidator = new InputValidator() as jest.Mocked<InputValidator>;
    (InputValidator as jest.Mock).mockImplementation(() => mockInputValidator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and the created producer when input is valid", async () => {
    const httpRequest: HttpRequest = {
      body: { producer: "testproducer", password: "testpass" },
    };

    const mockValidatedResult = { isValid: true, message: "" };
    mockInputValidator.compile.mockResolvedValue(mockValidatedResult);

    const mockProducerResponse = { id: "1", producer: "testproducer" };
    mockUsecase.execute.mockResolvedValue({ value: mockProducerResponse });

    const httpResponse: HttpResponse = await createProducerController.handle(
      httpRequest
    );

    expect(httpResponse.status).toBe(201);
    expect(httpResponse.value).toEqual(mockProducerResponse);
  });

  it("should return 400 when input validation fails", async () => {
    const httpRequest: HttpRequest = {
      body: { producer: "testproducer" },
    };

    const mockValidatedResult = {
      isValid: false,
      message: "Password is required",
    };
    mockInputValidator.compile.mockResolvedValue(mockValidatedResult);

    const httpResponse: HttpResponse = await createProducerController.handle(
      httpRequest
    );

    expect(Logger.ERROR).toHaveBeenCalledWith(
      `Input Schema Error: ${mockValidatedResult.message}`
    );
    expect(httpResponse.status).toBe(400);
    expect(httpResponse.error).toEqual(mockValidatedResult.message);
  });

  it("should return 400 when business rule error occurs", async () => {
    const httpRequest: HttpRequest = {
      body: { producer: "testproducer", password: "testpass" },
    };

    const mockValidatedResult = { isValid: true, message: "" };
    mockInputValidator.compile.mockResolvedValue(mockValidatedResult);

    const mockBusinessError = {
      message: "Producer already exists",
      status: 400,
    };
    mockUsecase.execute.mockResolvedValue({
      error: mockBusinessError as any,
      value: null,
    });

    const httpResponse: HttpResponse = await createProducerController.handle(
      httpRequest
    );

    expect(Logger.ERROR).toHaveBeenCalledWith(
      `Business Rule Error: ${JSON.stringify(mockBusinessError)}`
    );
    expect(httpResponse.status).toBe(400);
    expect(httpResponse.error).toEqual(mockBusinessError);
  });

  it("should return 422 when a server error occurs", async () => {
    const httpRequest: HttpRequest = {
      body: { producer: "testproducer", password: "testpass" },
    };

    const mockValidatedResult = { isValid: true, message: "" };
    mockInputValidator.compile.mockResolvedValue(mockValidatedResult);

    const mockServerError = new Error("Database connection error");
    mockUsecase.execute.mockRejectedValue(mockServerError);

    const httpResponse: HttpResponse = await createProducerController.handle(
      httpRequest
    );

    expect(Logger.ERROR).toHaveBeenCalledWith(
      `Server Error: "${mockServerError.message}"`
    );
    expect(httpResponse.status).toBe(422);
    expect(httpResponse.error).toEqual({
      code: "UNPROCESSABLE_ENTITY",
      title: "Unprocessable Entity",
      status: 422,
      detail: JSON.stringify(mockServerError.message),
    });
  });

  it("should handle CustomError and return the correct error response", async () => {
    const mockRequest: HttpRequest = {
      body: {
        name: "Invalid Name",
        document: "Invalid Document",
      },
    };
    const customError = new CustomError({
      code: ErrorCodes.UNPROCESSABLE_ENTITY,
      title: "Custom error message",
    });
    mockUsecase.execute.mockRejectedValue(customError);
    const response: HttpResponse = await createProducerController.handle(
      mockRequest
    );

    expect(response.status).toBe(422);
  });
});
