import { inject, Registry } from "@/infra/di/di";

describe("Registry", () => {
  let registry: Registry;

  beforeEach(() => {
    registry = Registry.getInstance();
    registry.provide = jest.fn(registry.provide);
    registry.inject = jest.fn(registry.inject);
  });

  it("should provide and inject a dependency", () => {
    const dependency = { log: () => "Logging..." };
    registry.provide("Logger", dependency);
    const injectedDependency = registry.inject("Logger");
    expect(injectedDependency).toBe(dependency);
    expect(registry.provide).toHaveBeenCalledWith("Logger", dependency);
    expect(registry.inject).toHaveBeenCalledWith("Logger");
  });

  it("should return undefined for missing dependencies", () => {
    const injectedDependency = registry.inject("MissingDependency");
    expect(injectedDependency).toBeUndefined();
    expect(registry.inject).toHaveBeenCalledWith("MissingDependency");
  });

  it("should return the same instance of the registry", () => {
    const firstInstance = Registry.getInstance();
    const secondInstance = Registry.getInstance();
    expect(firstInstance).toBe(secondInstance);
  });
});

describe("inject decorator", () => {
  let registry: Registry;

  beforeEach(() => {
    registry = Registry.getInstance();
    registry.provide("Logger", {
      log: () => "Logging...",
    });
  });

  it("should inject a dependency into a class property", () => {
    class TestClass {
      @inject("Logger")
      logger: any;
    }
    const instance = new TestClass();
    expect(instance.logger.log()).toBe("Logging...");
  });

  it("should throw an error when the dependency is missing", () => {
    class TestClass {
      @inject("MissingDependency")
      missing: any;
    }

    expect(() => {
      const instance = new TestClass();
      instance.missing.log();
    }).toThrow("MissingDependency dependency is missing");
  });

  it("should allow multiple dependencies to be injected", () => {
    registry.provide("Database", {
      connect: () => "Connected to DB",
    });

    class TestClass {
      @inject("Logger")
      logger: any;

      @inject("Database")
      database: any;
    }
    const instance = new TestClass();
    expect(instance.logger.log()).toBe("Logging...");
    expect(instance.database.connect()).toBe("Connected to DB");
  });
});
