import { GetDashboardController, Controller } from "@/interfaces/controllers";
import { makeGetDashboard } from "@/infra/server/factories/usecases";

export const makeGetDashboardController = (): Controller => {
  makeGetDashboard();
  return new GetDashboardController();
};
