import Producer from "@/domain/entity/producer";
import Farm, { IFarm } from "@/domain/entity/farm";
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
type Input = {
  name: string;
  document: string;
  farms: IFarm[];
};
type Output = {
  error?: Error;
  value?: any;
};

export class UpdateProducer {
  @inject("producerRepository")
  producerRepository?: ProducerRepository;
  @inject("farmRepository")
  farmRepository?: FarmRepository;
  @inject("cropRepository")
  cropRepository?: CropRepository;
  async execute(id: string, input: Input): Promise<Output> {
    const findedProducer = await this.producerRepository!.findById(id);
    const producer = new Producer({
      ...findedProducer.responseProducer(),
      ...input,
    });
    const updatedProducer = await this.producerRepository!.update(id, producer);
    const findedFarms = await this.farmRepository!.findByProducer(id);
    const farms = input.farms?.map((farm) => {
      const oldFarmData = findedFarms.find(
        (farmFinded) => farmFinded.getId() === farm.id
      );
      return new Farm({
        ...(oldFarmData?.responseFarm() ?? {}),
        ...farm,
        id_producer: id,
      });
    });
    const farmResponse = await this.farmRepository!.updateMany(farms);
    const reponse = updatedProducer.responseProducer(farmResponse);
    return { value: reponse };
  }
}
