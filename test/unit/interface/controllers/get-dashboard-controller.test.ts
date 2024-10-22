import { GetDashboard } from "@/application/usecases";
import { HttpResponse } from "@/interfaces/presentations";
import { Logger } from "@/infra/logger";
import { AJVCompile as InputValidator } from "@/infra/input-validator";
import { GetDashboardController } from "@/interfaces/controllers";
import CustomError, { ErrorCodes } from "@/domain/entity/error";

jest.mock("@/application/usecases", () => {
  return {
    GetDashboard: jest.fn().mockImplementation(() => ({
      execute: jest.fn(),
    })),
  };
});

jest.mock("@/infra/logger");
jest.mock("@/infra/input-validator");

describe("GetDashboardController", () => {
  let createProducerController: GetDashboardController;
  let mockUsecase: jest.Mocked<GetDashboard>;
  let mockInputValidator: jest.Mocked<InputValidator>;

  beforeEach(() => {
    mockUsecase = new (require("@/application/usecases").GetDashboard)();

    createProducerController = new GetDashboardController();
    createProducerController.usecase = mockUsecase;

    mockInputValidator = new InputValidator() as jest.Mocked<InputValidator>;
    (InputValidator as jest.Mock).mockImplementation(() => mockInputValidator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and the created producer when input is valid", async () => {
    const mockValidatedResult = { isValid: true, message: "" };
    mockInputValidator.compile.mockResolvedValue(mockValidatedResult);

    const mockProducerResponse = { id: "1", producer: "testproducer" };
    mockUsecase.execute.mockResolvedValue({ value: mockProducerResponse });

    const httpResponse: HttpResponse = await createProducerController.handle();

    expect(httpResponse.status).toBe(200);
    expect(httpResponse.value).toEqual(mockProducerResponse);
  });

  it("should return 400 when business rule error occurs", async () => {
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

    const httpResponse: HttpResponse = await createProducerController.handle();

    expect(Logger.ERROR).toHaveBeenCalledWith(
      `Business Rule Error: ${JSON.stringify(mockBusinessError)}`
    );
    expect(httpResponse.status).toBe(400);
    expect(httpResponse.error).toEqual(mockBusinessError);
  });

  it("should return 422 when a server error occurs", async () => {
    const mockValidatedResult = { isValid: true, message: "" };
    mockInputValidator.compile.mockResolvedValue(mockValidatedResult);

    const mockServerError = new Error("Database connection error");
    mockUsecase.execute.mockRejectedValue(mockServerError);

    const httpResponse: HttpResponse = await createProducerController.handle();

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
    const customError = new CustomError({
      code: ErrorCodes.UNPROCESSABLE_ENTITY,
      title: "Custom error message",
    });
    mockUsecase.execute.mockRejectedValue(customError);
    const response: HttpResponse = await createProducerController.handle();

    expect(response.status).toBe(422);
  });
});
