import { ExpressAdapter } from "@/infra/http/express-adapter";
import express from "express";

const mockLogger = {
  INFO: jest.fn(),
  ERROR: jest.fn(),
};

jest.mock("express", () => {
  const originalModule = jest.requireActual("express");
  const mockListen = jest.fn().mockImplementation((port, callback) => {
    callback();
    return {
      on: jest.fn((event, cb) => {
        return { on: jest.fn() };
      }),
    };
  });

  const mockApp = {
    get: jest.fn(() => jest.fn()),
    post: jest.fn(() => jest.fn()),
    patch: jest.fn(() => jest.fn()),
    put: jest.fn(() => jest.fn()),
    delete: jest.fn(() => jest.fn()),
    use: jest.fn(() => jest.fn()),
    json: jest.fn(() => jest.fn()),
    listen: mockListen,
  };
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => mockApp),
    json: jest.fn(),
    use: jest.fn(),
    listen: mockListen,
  };
});

describe("ExpressAdapter", () => {
  let adapter: ExpressAdapter;

  beforeEach(() => {
    adapter = new ExpressAdapter();
    adapter.app = express();
    (adapter as any).Logger = mockLogger;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should register routes for all HTTP methods", () => {
    const mockCallback = jest.fn();
    const methods = ["get", "post", "patch", "put", "delete"] as const;
    const url = "/test";

    methods.forEach((method) => {
      adapter.register(method, url, mockCallback);
      expect(adapter.app[method]).toHaveBeenCalledWith(
        `/v1${url}`,
        expect.any(Function)
      );
    });
  });
  it("should respond with status 422 when callback throws an error", async () => {
    const mockCallback = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    adapter.register("get", "/error", mockCallback);
    const routeHandler = (adapter.app.get as jest.Mock).mock.calls[0][1];

    await routeHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({ message: "Test error" });
  });
  it("should start the server and log startup success", () => {
    const port = 3000;

    adapter.listen(port);

    expect(adapter.app.listen).toHaveBeenCalledWith(port, expect.any(Function));
    expect(adapter.Logger.INFO).toHaveBeenCalledWith(
      "✅ [Successfully] - Server Startup - port: " + port
    );
  });

  it("should use middleware function with the express app", () => {
    const mockMiddleware = jest.fn();

    adapter.use(mockMiddleware as any);

    expect(adapter.app.use).toHaveBeenCalledWith(mockMiddleware);
  });

  it("should log route registration details correctly", () => {
    const mockCallback = jest.fn();
    const url = "/test";
    const version = "v1";

    adapter.register("get", url, mockCallback, version);
    expect(adapter.Logger.INFO).toHaveBeenCalledWith(
      "✅ Registering route: get | /v1/test"
    );
    expect(adapter.app.get).toHaveBeenCalledWith(
      `/v1${url}`,
      expect.any(Function)
    );

    adapter.register("post", url, mockCallback, version);
    expect(adapter.Logger.INFO).toHaveBeenCalledWith(
      "✅ Registering route: post | /v1/test"
    );
    expect(adapter.app.post).toHaveBeenCalledWith(
      `/v1${url}`,
      expect.any(Function)
    );

    adapter.register("patch", url, mockCallback, version);
    expect(adapter.Logger.INFO).toHaveBeenCalledWith(
      "✅ Registering route: patch | /v1/test"
    );
    expect(adapter.app.patch).toHaveBeenCalledWith(
      `/v1${url}`,
      expect.any(Function)
    );

    adapter.register("put", url, mockCallback, version);
    expect(adapter.Logger.INFO).toHaveBeenCalledWith(
      "✅ Registering route: put | /v1/test"
    );
    expect(adapter.app.put).toHaveBeenCalledWith(
      `/v1${url}`,
      expect.any(Function)
    );

    adapter.register("delete", url, mockCallback, version);
    expect(adapter.Logger.INFO).toHaveBeenCalledWith(
      "✅ Registering route: delete | /v1/test"
    );
    expect(adapter.app.delete).toHaveBeenCalledWith(
      `/v1${url}`,
      expect.any(Function)
    );
  });

  it("should throw an error when registering a route with an unsupported HTTP method", () => {
    const mockCallback = jest.fn();
    const unsupportedMethod = "invalid";
    const url = "/test";

    expect(() =>
      adapter.register(unsupportedMethod as any, url, mockCallback)
    ).toThrow();
  });

  it("should register routes with complex URLs or parameters", () => {
    const mockCallback = jest.fn();
    const url = "/test";
    const version = "v1";
    const method = "get";

    adapter.register(method, url, mockCallback, version);
    expect(adapter.Logger.INFO).toHaveBeenCalledWith(
      "✅ Registering route: " + method + " | " + `/${version}${url}`
    );
    expect(adapter.app[method]).toHaveBeenCalledWith(
      `/${version}${url}`,
      expect.any(Function)
    );
  });

  it("should log an error when the server fails to start", () => {
    const mockListen = jest.fn().mockReturnValue({
      on: jest.fn((event, callback) => {
        if (event === "error") {
          callback(new Error("Mocked server error"));
        }
      }),
    });

    (express as any).mockReturnValue({
      listen: mockListen,
    });
    adapter = new ExpressAdapter();
    adapter.app = express();
    (adapter as any).Logger = mockLogger;

    const port = 3000;

    adapter.listen(port);

    expect(mockLogger.INFO).toHaveBeenCalledWith(
      "❌ [Unsuccessfully] - Server Startup:"
    );
    expect(mockLogger.ERROR).toHaveBeenCalledWith(expect.any(Error));
    expect(mockLogger.ERROR).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Mocked server error" })
    );
  });
});
