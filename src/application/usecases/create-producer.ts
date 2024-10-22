import Producer from "@/domain/entity/producer";
import Farm, { IFarm } from "@/domain/entity/farm";
import { inject } from "@/infra/di/di";
import ProducerRepository from "@/infra/repository/producer-repository";
import FarmRepository from "@/infra/repository/farm-repository";
import CropRepository from "@/infra/repository/crop-repository";
import CustomError, { ErrorCodes } from "@/domain/entity/error";

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

export class CreateProducer {
  @inject("producerRepository")
  producerRepository?: ProducerRepository;
  @inject("farmRepository")
  farmRepository?: FarmRepository;
  @inject("cropRepository")
  cropRepository?: CropRepository;
  async execute(input: Input): Promise<Output> {
    const producer = new Producer(input);
    const producerResponse = await this.producerRepository!.upsert(producer);
    const farms = input.farms.map(
      (farm) => new Farm({ ...farm, id_producer: producerResponse!.getId() })
    );
    const cropList = farms
      .map((farm) => farm.getCrops().map((crop) => crop.getId()))
      .flat(1);
    const cropResponse = await this.cropRepository!.find({ id: cropList });
    const invalidCropList = cropList?.filter(
      (crop) =>
        !cropResponse?.map((cropClass) => String(cropClass.getId())).includes(crop)
    );
    if (invalidCropList.length) {
      throw new CustomError({
        code: ErrorCodes.INVALID_PARAMS,
        title: `Invalid crop_id: ${invalidCropList.join(", ")} `,
      });
    }
    const farmResponse = await this.farmRepository!.saveMany(farms);
    return { value: producerResponse.responseProducer(farmResponse!) };
  }
}
