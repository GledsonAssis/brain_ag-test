import { response } from "@/interfaces/presentations/http";

describe("response", () => {
  it("should return correct HttpResponse when data is valid", () => {
    const data = { error: null, value: "Success" };
    const status = 200;
    const result = response(data, status);
    expect(result).toEqual({ error: null, value: "Success", status: 200 });
  });

  it("should handle undefined data without throwing errors", () => {
    const status = 500;
    const result = response(undefined, status);
    expect(result).toEqual({ error: undefined, value: undefined, status: 500 });
  });

  it("should return correct HttpResponse when data has both error and value properties", () => {
    const data = { error: "Error message", value: "Value data" };
    const status = 404;
    const result = response(data, status);
    expect(result).toEqual({
      error: "Error message",
      value: "Value data",
      status: 404,
    });
  });

  it("should correctly assign status to HttpResponse", () => {
    const data = { error: "Something went wrong", value: null };
    const status = 404;
    const result = response(data, status);
    expect(result).toEqual({
      error: "Something went wrong",
      value: null,
      status: 404,
    });
  });

  it("should return correct HttpResponse when data is null", () => {
    const data = null;
    const status = 200;
    const result = response(data, status);
    expect(result).toEqual({ error: undefined, value: undefined, status: 200 });
  });

  it("should return correct HttpResponse when data has only error property", () => {
    const data = { error: "Something went wrong" };
    const status = 500;
    const result = response(data, status);
    expect(result).toEqual({
      error: "Something went wrong",
      value: undefined,
      status: 500,
    });
  });

  it("should return correct HttpResponse when data is valid", () => {
    const data = { error: null, value: "Success" };
    const status = 200;
    const result = response(data, status);
    expect(result).toEqual({ error: null, value: "Success", status: 200 });
  });

  it("should return correct HttpResponse when data is a string", () => {
    const data = "Sample Data";
    const status = 200;
    const result = response(data, status);
    expect(result).toEqual({ error: undefined, value: undefined, status: 200 });
  });
});
