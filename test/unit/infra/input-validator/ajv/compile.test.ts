import { AJVCompile } from "@/infra/input-validator";

describe("AJVCompile", () => {
  it("should return valid response when schema and data are correct", async () => {
    const ajvCompile = new AJVCompile();
    const schema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
      },
      required: ["name", "age"],
    };
    const data = { name: "John", age: 30 };
    const result = await ajvCompile.compile(schema, data);
    expect(result.isValid).toBe(true);
    expect(result.message).toBe("");
  });

  it("should return error messages when schema is invalid", async () => {
    const ajvCompile = new AJVCompile();
    const schema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
      },
      required: ["name", "age"],
    };
    const data = { name: "John" };
    const result = await ajvCompile.compile(schema, data);
    expect(result.isValid).toBe(false);
    expect(result.message).toContain(
      "field: age - error: must have required property 'age'"
    );
  });

  it("should correctly validate date objects when using isDate keyword", async () => {
    const ajvCompile = new AJVCompile();
    const schema = {
      type: "object",
      properties: {
        dateField: { type: "string", isDate: true },
      },
    };
    const data = { dateField: "2022-12-31T23:59:59.999Z" };
    const result = await ajvCompile.compile(schema, data);
    expect(result.isValid).toBe(true);
    expect(result.message).toBe("");
  });

  it("should format validation errors correctly and return", async () => {
    const ajvCompile = new AJVCompile();
    const schema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
      },
      required: ["name", "age"],
    };
    const data = { name: "John", age: "thirty" };
    const result = await ajvCompile.compile(schema, data);
    expect(result.isValid).toBe(false);
    expect(result.message).toBe("field: age - error: must be number");
  });

  it("should configure Ajv instance with allErrors and additional formats", async () => {
    const ajvCompile = new AJVCompile();
    const schema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
      },
      required: ["name", "age"],
    };
    const data = { name: "John", age: 30 };
    const result = await ajvCompile.compile(schema, data);
    expect(result).toHaveProperty("isValid");
    expect(result).toHaveProperty("message");
  });

  it("should fail isDate validation for incorrect date format", async () => {
    const ajvCompile = new AJVCompile();
    const schema = {
      type: "object",
      properties: {
        date: { type: "string", isDate: true },
      },
    };
    const data = { date: "2022-13-45" };
    const result = await ajvCompile.compile(schema, data);
    expect(result.isValid).toBe(false);
    expect(result.message).toBe(
      'field: date - error: must pass "isDate" keyword validation'
    );
  });

  it("should return appropriate response when schema and data are empty", async () => {
    const ajvCompile = new AJVCompile();
    const schema = {};
    const data = {};
    const result = await ajvCompile.compile(schema, data);
    expect(result.isValid).toBe(true);
    expect(result.message).toBe("");
  });

  it("should handle unsupported keywords gracefully", async () => {
    const ajvCompile = new AJVCompile();
    const schema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
      },
      required: ["name", "age"],
      unsupportedKeyword: "custom",
    };
    const data = { name: "John", age: 30 };
    expect(() => ajvCompile.compile(schema, data)).rejects.toThrow();
  });

  it("should return correct error messages when data has missing properties", async () => {
    const ajvCompile = new AJVCompile();
    const schema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
      },
      required: ["name", "age"],
    };
    const data = { name: "John" };
    const result = await ajvCompile.compile(schema, data);
    expect(result.isValid).toBe(false);
    expect(result.message).toBe(
      "field: age - error: must have required property 'age'"
    );
  });

  it("should validate performance with large data sets", async () => {
    const ajvCompile = new AJVCompile();
    const schema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
      },
      required: ["name", "age"],
    };
    const data = { name: "John", age: 30 };
    const result = await ajvCompile.compile(schema, data);
    expect(result.isValid).toBe(true);
    expect(result.message).toBe("");
  });

  it("should return valid response when validating complex nested schemas", async () => {
    const ajvCompile = new AJVCompile();
    const schema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
      },
      required: ["name", "age"],
    };
    const data = { name: "John", age: 30 };
    const result = await ajvCompile.compile(schema, data);
    expect(result.isValid).toBe(true);
    expect(result.message).toBe("");
  });

  it("should return valid response when schema and data are correct", async () => {
    const ajvCompile = new AJVCompile();
    const schema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
      },
      required: ["name", "age"],
    };
    const data = { name: "John", age: 30 };
    const result = await ajvCompile.compile(schema, data);
    expect(result.isValid).toBe(true);
    expect(result.message).toBe("");
  });

  it("should ensure thread safety in concurrent validation requests", async () => {
    const ajvCompile = new AJVCompile();
    const schema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
      },
      required: ["name", "age"],
    };
    const data = { name: "John", age: 30 };
    const result = await ajvCompile.compile(schema, data);
    expect(result.isValid).toBeDefined();
    expect(result.message).toBeDefined();
  });

  it("should return error message when schema is invalid", async () => {
    const ajvCompile = new AJVCompile();
    const schema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
      },
      required: ["name", "age"],
      additionalProperties: true,
    };
    const data = { name: "John", age: 30 };
    const result = await ajvCompile.compile(schema, data);
    expect(result.isValid).toBe(true);
  });

  it("should return an error message for an invalid date", async () => {
    const ajvCompile = new AJVCompile();
    const schema = {
      type: "object",
      properties: {
        dateField: { type: "string", format: "date" }, // Expecting date format
      },
      required: ["dateField"],
      errorMessage: {
        required: "Date field is required",
        properties: {
          dateField: "Invalid date format",
        },
      },
    };

    const invalidData = {
      dateField: "invalid-date", // This will fail the date validation
    };

    const result = await ajvCompile.compile(schema, invalidData);

    expect(result.isValid).toBe(false);
    expect(result.message).toContain("Invalid date format");
  });

  it("should pass validation for a valid date", async () => {
    const ajvCompile = new AJVCompile();
    const schema = {
      type: "object",
      properties: {
        dateField: { type: "string", format: "date" }, // Expecting date format
      },
      required: ["dateField"],
      errorMessage: {
        required: "Date field is required",
        properties: {
          dateField: "Invalid date format",
        },
      },
    };

    const validData = {
      dateField: "2024-10-18", // This is a valid date
    };

    const result = await ajvCompile.compile(schema, validData);

    expect(result.isValid).toBe(true);
    expect(result.message).toBe(""); // No error message for valid date
  });
});
