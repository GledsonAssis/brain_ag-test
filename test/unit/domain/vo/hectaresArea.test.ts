import HectaresArea from "@/domain/vo/hectaresArea";

describe("HectaresArea", () => {
  it("should initialize properties correctly when totals are valid", () => {
    const total = 100;
    const arable = 60;
    const vegetation = 40;
    const hectaresArea = new HectaresArea(total, arable, vegetation);

    expect(hectaresArea.getTotalAreaHectares()).toBe(total);
    expect(hectaresArea.getArableAreaHectares()).toBe(arable);
    expect(hectaresArea.getVegetationAreaHectares()).toBe(vegetation);
  });

  it("should throw error when arable and vegetation areas do not sum to total", () => {
    const total = 100;
    const arable = 50;
    const vegetation = 40;

    expect(() => {
      new HectaresArea(total, arable, vegetation);
    }).toThrow("Invalid totals");
  });

  it("should return the correct total area when initialized with valid totals", () => {
    const total = 100;
    const arable = 60;
    const vegetation = 40;
    const hectaresArea = new HectaresArea(total, arable, vegetation);

    expect(hectaresArea.getTotalAreaHectares()).toBe(total);
  });

  it("should return correct arable area", () => {
    const total = 100;
    const arable = 60;
    const vegetation = 40;
    const hectaresArea = new HectaresArea(total, arable, vegetation);

    expect(hectaresArea.getArableAreaHectares()).toBe(arable);
  });

  it("should return correct vegetation area", () => {
    const total = 100;
    const arable = 60;
    const vegetation = 40;
    const hectaresArea = new HectaresArea(total, arable, vegetation);

    expect(hectaresArea.getVegetationAreaHectares()).toBe(vegetation);
  });

  it("should throw error when all areas are zero", () => {
    expect(() => new HectaresArea(0, 0, 0)).toThrow("Invalid totals");
  });

  it("should handle floating-point precision in area calculations", () => {
    const total = 100.1;
    const arable = 60.05;
    const vegetation = 40.05;
    const hectaresArea = new HectaresArea(total, arable, vegetation);

    expect(hectaresArea.getTotalAreaHectares()).toBe(total);
    expect(hectaresArea.getArableAreaHectares()).toBe(arable);
    expect(hectaresArea.getVegetationAreaHectares()).toBe(vegetation);
  });

  it("should throw an error when total area exceeds maximum safe integer value", () => {
    const total = Number.MAX_SAFE_INTEGER + 1;
    const arable = 60;
    const vegetation = 40;

    expect(() => new HectaresArea(total, arable, vegetation)).toThrow(
      "Invalid totals"
    );
  });

  it("should throw error when negative values are provided", () => {
    expect(() => new HectaresArea(-100, 50, 50)).toThrow("Invalid totals");
    expect(() => new HectaresArea(100, -50, 50)).toThrow("Invalid totals");
    expect(() => new HectaresArea(100, 50, -50)).toThrow("Invalid totals");
  });

  it("should throw error when sum of arable and vegetation areas exceed total", () => {
    const total = 100;
    const arable = 60;
    const vegetation = 50;

    expect(() => new HectaresArea(total, arable, vegetation)).toThrow(
      "Invalid totals"
    );
  });

  it("should success when all areas are equal", () => {
    const total = 100;
    const arable = 50;
    const vegetation = 50;

    expect(() => new HectaresArea(total, arable, vegetation)).not.toThrow();
  });
});
