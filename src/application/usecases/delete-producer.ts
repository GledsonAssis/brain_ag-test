import { inject } from "@/infra/di/di";
import ProducerRepository from "@/infra/repository/producer-repository";
import FarmRepository from "@/infra/repository/farm-repository";

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

export class DeleteProducer {
  @inject("producerRepository")
  producerRepository?: ProducerRepository;
  @inject("farmRepository")
  farmRepository?: FarmRepository;
  async execute(id: string): Promise<Output> {
    await this.producerRepository!.findById(id);
    await this.farmRepository!.deleteByProducerId(id);
    await this.producerRepository!.deleteById(id);
    return { value: { data: "Id " + id + " removed with success" } };
  }
}
