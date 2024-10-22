import { Controller } from "@/interfaces/controllers";
import { HttpRequest } from "@/interfaces/presentations";

export const adaptRoute =
  (controller: Controller) => async (req: any, res: any) => {
    res.setHeader("x-correlation-id", req.headers["x-correlation-id"]);
    res.setHeader("x-request-id", req.headers["x-request-id"]);
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
    };
    const { status, value, error } = await controller.handle(httpRequest);
    if (status < 400) {
      return res.status(status).json(value);
    }
    return res.status(status).json({ error });
  };
