import Name from "@/domain/vo/name";
import City from "@/domain/vo/city";
import State from "@/domain/vo/state";
import HectaresArea from "@/domain/vo/hectaresArea";
import Crop, { ICrop } from "@/domain/entity/crop";

export interface IFarm {
  _id?: string;
  id?: string;
  id_producer?: string;
  name: string;
  city: string;
  state: string;
  total_area_hectares: number;
  arable_area_hectares: number;
  vegetation_area_hectares: number;
  crops: (string | ICrop)[];
}

export default class Farm {
  private readonly id: string = "";
  private readonly id_producer?: string;
  private readonly name: Name;
  private readonly city: City;
  private readonly state: State;
  private readonly hectaresArea: HectaresArea;
  private readonly crops: Crop[];

  constructor(farm: IFarm) {
    const hectaresArea = new HectaresArea(
      Number(farm.total_area_hectares),
      Number(farm.arable_area_hectares),
      Number(farm.vegetation_area_hectares)
    );
    this.id = String(farm?._id ?? farm?.id ?? "");
    this.name = new Name(farm?.name);
    this.city = new City(farm?.city);
    this.state = new State(farm?.state);
    this.id_producer = farm.id_producer;
    this.hectaresArea = hectaresArea;
    this.crops = this.cropList(farm?.crops);
  }

  private cropList(cropArray: (string | ICrop)[] = []): Crop[] {
    return cropArray.map((crop) => {
      if (typeof crop === "string") {
        return new Crop({ id: crop });
      }
      return new Crop({ id: crop.id, name: crop.name });
    });
  }

  pushCrop(crop: ICrop): void {
    this.crops.push(new Crop(crop));
  }

  getName() {
    return this.name.getValue();
  }

  getIdProducer() {
    return this.id_producer;
  }

  getCity() {
    return this.city.getValue();
  }

  getState() {
    return this.state.getValue();
  }

  getTotalAreaHectares() {
    return this.hectaresArea.getTotalAreaHectares();
  }

  getArableAreaHectares() {
    return this.hectaresArea.getArableAreaHectares();
  }

  getVegetationAreaHectares() {
    return this.hectaresArea.getVegetationAreaHectares();
  }

  getCrops() {
    return this.crops;
  }

  getId() {
    return this.id;
  }

  responseFarm() {
    return {
      id: this.id || undefined,
      name: this.name.getValue(),
      city: this.city.getValue(),
      state: this.state.getValue(),
      total_area_hectares: this.hectaresArea.getTotalAreaHectares(),
      arable_area_hectares: this.hectaresArea.getArableAreaHectares(),
      vegetation_area_hectares: this.hectaresArea.getVegetationAreaHectares(),
      crops: this.crops.map((crops) => crops.responseCrop()),
    };
  }
}
