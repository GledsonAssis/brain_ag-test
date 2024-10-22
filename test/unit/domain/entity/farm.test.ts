import Farm, { IFarm } from "@/domain/entity/farm";
import Crop, { ICrop } from "@/domain/entity/crop";
import Name from "@/domain/vo/name";
import City from "@/domain/vo/city";
import State from "@/domain/vo/state";
import HectaresArea from "@/domain/vo/hectaresArea";

jest.mock("@/domain/vo/name");
jest.mock("@/domain/vo/city");
jest.mock("@/domain/vo/state");
jest.mock("@/domain/vo/hectaresArea");
jest.mock("@/domain/entity/crop");

describe("Farm", () => {
  const nameMock = "Test Farm";
  const cityMock = "Test City";
  const stateMock = "Test State";
  const mockHectaresArea = {
    getTotalAreaHectares: jest.fn().mockReturnValue(100),
    getArableAreaHectares: jest.fn().mockReturnValue(50),
    getVegetationAreaHectares: jest.fn().mockReturnValue(30),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (Name.prototype.getValue as jest.Mock).mockReturnValue(nameMock);
    (City.prototype.getValue as jest.Mock).mockReturnValue(cityMock);
    (State.prototype.getValue as jest.Mock).mockReturnValue(stateMock);
    (HectaresArea as jest.Mock).mockImplementation(() => mockHectaresArea);
  });

  it("should initialize Farm with valid IFarm data", () => {
    const farmData: IFarm = {
      id: "123",
      name: "Test Farm",
      city: "Test City",
      id_producer: "1",
      state: "Test State",
      total_area_hectares: 100,
      arable_area_hectares: 50,
      vegetation_area_hectares: 30,
      crops: ["crop1", { id: "crop2", name: "Crop 2" }],
    };

    const farm = new Farm(farmData);

    expect(farm.getId()).toBe("123");
    expect(farm.getName()).toBe("Test Farm");
    expect(farm.getCity()).toBe("Test City");
    expect(farm.getIdProducer()).toBe("1");
    expect(farm.getState()).toBe("Test State");
    expect(farm.getTotalAreaHectares()).toBe(100);
    expect(farm.getArableAreaHectares()).toBe(50);
    expect(farm.getVegetationAreaHectares()).toBe(30);
    expect(farm.getCrops()).toHaveLength(2);
  });
  
  it("should without crop", () => {
    const farmData: any = {
      id: "123",
      name: "Test Farm",
      city: "Test City",
      id_producer: "1",
      state: "Test State",
      total_area_hectares: 100,
      arable_area_hectares: 50,
      vegetation_area_hectares: 30,
    };

    const farm = new Farm(farmData);

    expect(farm.getCrops()).toHaveLength(0);
  });

  it("should initialize Farm with default crop list when crops are not provided", () => {
    const farmData: IFarm = {
      id: "123",
      name: "Test Farm",
      city: "Test City",
      state: "Test State",
      total_area_hectares: 100,
      arable_area_hectares: 50,
      vegetation_area_hectares: 30,
      crops: [],
    };

    const farm = new Farm(farmData);
    expect(farm.getCrops()).toHaveLength(0);
  });

  it("should return responseFarm with crops data", () => {
    const farmData: IFarm = {
      id: "123",
      name: "Test Farm",
      city: "Test City",
      state: "Test State",
      total_area_hectares: 100,
      arable_area_hectares: 50,
      vegetation_area_hectares: 30,
      crops: ["crop1", { id: "crop2", name: "Crop 2" }],
    };
    (Crop.prototype.responseCrop as jest.Mock)
      .mockReturnValueOnce({ id: "crop1", name: undefined })
      .mockReturnValueOnce({ id: "crop2", name: "Crop 2" });

    const farm = new Farm(farmData);
    const response = farm.responseFarm();

    expect(response).toEqual({
      id: "123",
      name: "Test Farm",
      city: "Test City",
      state: "Test State",
      total_area_hectares: 100,
      arable_area_hectares: 50,
      vegetation_area_hectares: 30,
      crops: [
        { id: "crop1", name: undefined }, // mock implementation of Crop class
        { id: "crop2", name: "Crop 2" },
      ],
    });
  });

  it("should add a new crop using pushCrop method", () => {
    const farmData: IFarm = {
      id: "123",
      name: "Test Farm",
      city: "Test City",
      state: "Test State",
      total_area_hectares: 100,
      arable_area_hectares: 50,
      vegetation_area_hectares: 30,
      crops: [],
    };

    const farm = new Farm(farmData);
    const newCrop: ICrop = { id: "crop3", name: "Crop 3" };
    (Crop.prototype.responseCrop as jest.Mock).mockReturnValueOnce({
      id: "crop3",
      name: "Crop 3",
    });

    farm.pushCrop(newCrop);

    expect(farm.getCrops()).toHaveLength(1);
    expect(farm.getCrops()[0]).toBeInstanceOf(Crop);
    expect(farm.getCrops()[0].responseCrop()).toEqual({
      id: "crop3",
      name: "Crop 3",
    });
  });

  it("should handle undefined or empty id correctly", () => {
    const farmData: IFarm = {
      name: "Test Farm",
      city: "Test City",
      state: "Test State",
      total_area_hectares: 100,
      arable_area_hectares: 50,
      vegetation_area_hectares: 30,
      crops: [],
    };

    const farm = new Farm(farmData);

    const response = farm.responseFarm();

    expect(response.id).toBeUndefined(); // No id provided, should be undefined
  });

  it("should handle _id field correctly as id", () => {
    const farmData: IFarm = {
      _id: "abc123",
      name: "Test Farm",
      city: "Test City",
      state: "Test State",
      total_area_hectares: 100,
      arable_area_hectares: 50,
      vegetation_area_hectares: 30,
      crops: [],
    };

    const farm = new Farm(farmData);

    expect(farm.getId()).toBe("abc123");
  });
});
