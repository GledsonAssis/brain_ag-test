import State from "@/domain/vo/state";

describe("State", () => {
  it("should initialize correctly when given a valid state code", () => {
    const state = new State("SP");
    expect(state.getValue()).toBe("SP");
  });

  it("should throw an error when given an empty string", () => {
    expect(() => new State("")).toThrow(
      "Invalid state: The name must contain in list of brazilian states"
    );
  });

  it("should return the correct state code when initialized with a valid state code", () => {
    const state = new State("SP");
    expect(state.getValue()).toBe("SP");
  });

  it("should not throw an error when initializing with a valid state code", () => {
    expect(() => new State("SP")).not.toThrow();
  });

  it("should throw an error when value is null", () => {
    expect(() => new State(null as any)).toThrow(
      "Invalid state: The name must contain in list of brazilian states"
    );
  });

  it("should throw an error when value is undefined", () => {
    expect(() => new State(undefined as any)).toThrow(
      "Invalid state: The name must contain in list of brazilian states"
    );
  });

  it("should throw an error when initialized with a non-string value", () => {
    expect(() => new State(123 as any)).toThrow(
      "Invalid state: The name must contain in list of brazilian states"
    );
  });

  it("should success for lowercase state code", () => {
    expect(() => new State("sp")).not.toThrow();
  });

  it("should throw an error for an invalid state code", () => {
    expect(() => new State("XYZ")).toThrow(
      "Invalid state: The name must contain in list of brazilian states"
    );
  });

  it("should handle whitespace around valid state code", () => {
    const state = new State("  SP  ");
    expect(state.getValue()).toBe("SP");
  });

  it("should initialize correctly when given a mixed case valid state code", () => {
    const state = new State("sP");
    expect(state.getValue()).toBe("sP");
  });

  it("should throw error when given an invalid state code with special characters", () => {
    expect(() => new State("!@#")).toThrow(
      "Invalid state: The name must contain in list of brazilian states"
    );
  });

  it("should throw an error when initialized with a numeric string", () => {
    expect(() => new State("123")).toThrow(
      "Invalid state: The name must contain in list of brazilian states"
    );
  });
});
