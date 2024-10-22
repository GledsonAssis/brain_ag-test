import { inject } from "@/infra/di/di";
import ProducerRepository from "@/infra/repository/producer-repository";
import FarmRepository from "@/infra/repository/farm-repository";
import CropRepository from "@/infra/repository/crop-repository";

type Error = {
  code: string;
  detail: string;
  status: number;
  title: string;
};
type Output = {
  error?: Error;
  value?: any;
};

export class GetDashboard {
  @inject("producerRepository")
  producerRepository?: ProducerRepository;
  @inject("farmRepository")
  farmRepository?: FarmRepository;
  @inject("cropRepository")
  cropRepository?: CropRepository;
  async execute(): Promise<Output> {
    const response = await this.farmRepository!.getDashboard();
    return { value: response };
  }
}
