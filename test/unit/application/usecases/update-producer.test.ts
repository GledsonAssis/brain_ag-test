import Producer from "@/domain/entity/producer";
import Farm from "@/domain/entity/farm";
import { UpdateProducer } from "@/application/usecases/update-producer";
import ProducerRepository from "@/infra/repository/producer-repository";
import FarmRepository from "@/infra/repository/farm-repository";
import CropRepository from "@/infra/repository/crop-repository";

jest.mock("@/domain/entity/producer");
jest.mock("@/domain/entity/farm", () => {
  return jest.fn().mockImplementation((data) => {
    return {
      getName: jest.fn().mockReturnValue(data.name),
      getCity: jest.fn().mockReturnValue(data.city),
      getState: jest.fn().mockReturnValue(data.state),
      getTotalAreaHectares: jest.fn().mockReturnValue(data.total_area_hectares),
      getArableAreaHectares: jest
        .fn()
        .mockReturnValue(data.arable_area_hectares),
      getVegetationAreaHectares: jest
        .fn()
        .mockReturnValue(data.vegetation_area_hectares),
      getIdProducer: jest.fn().mockReturnValue(data.id_producer),
      getId: jest.fn().mockReturnValue(data.id),
      getCrops: jest.fn().mockReturnValue(
        data.crops.map((item: string) => ({
          getId: jest.fn().mockReturnValue(item),
        }))
      ),
    };
  }) as jest.Mocked<Partial<Farm>>;
});
jest.mock("@/infra/repository/producer-repository");
jest.mock("@/infra/repository/farm-repository");
jest.mock("@/infra/repository/crop-repository");

describe("UpdateProducer", () => {
  let updateProducer: UpdateProducer;
  let mockProducerRepository: jest.Mocked<ProducerRepository>;
  let mockFarmRepository: jest.Mocked<FarmRepository>;
  let mockCropRepository: jest.Mocked<CropRepository>;

  beforeEach(() => {
    mockProducerRepository = {
      findById: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
      upsert: jest.fn(),
    } as unknown as jest.Mocked<ProducerRepository>;
    mockFarmRepository = {
      findByProducer: jest.fn(),
      updateMany: jest.fn(),
      save: jest.fn(),
      saveMany: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<FarmRepository>;
    mockCropRepository = {
      find: jest.fn(),
    } as unknown as jest.Mocked<CropRepository>;

    updateProducer = new UpdateProducer();
    updateProducer.producerRepository = mockProducerRepository;
    updateProducer.farmRepository = mockFarmRepository;
    updateProducer.cropRepository = mockCropRepository;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve atualizar produtor mesmo se não houver alterações nas fazendas", async () => {
    const id = "producer-id";
    const input = {
      name: "New Producer Name",
      document: "012.456.789-90",
      farms: [],
    };

    const findedProducer = new Producer({
      name: "Old Producer Name",
      document: "123456789",
    });

    mockProducerRepository.findById.mockResolvedValue(findedProducer);
    mockProducerRepository.update.mockResolvedValue({
      responseProducer: () => ({
        id: "producer-id",
        name: "New Producer Name",
        document: "012.456.789-90",
        farms: [],
        isActive: true,
      }),
    } as any);
    mockFarmRepository.findByProducer.mockResolvedValue([]);

    const result = await updateProducer.execute(id, input);

    expect(mockProducerRepository.findById).toHaveBeenCalledWith(id);
    expect(mockProducerRepository.update).toHaveBeenCalledWith(
      id,
      expect.any(Producer)
    );
    expect(mockFarmRepository.findByProducer).toHaveBeenCalledWith(id);
    expect(mockFarmRepository.updateMany).toHaveBeenCalledWith([]);
    expect(result.value).toEqual({
      id: "producer-id",
      name: "New Producer Name",
      document: "012.456.789-90",
      farms: [],
      isActive: true,
    });
  });

  it("deve atualizar produtor mesmo se houver alterações nas fazendas", async () => {
    const id = "producer-id";
    const input = {
      name: "New Producer Name",
      document: "012.456.789-90",
      farms: [
        {
          name: "fazenda Teste 6",
          city: "Cidade 2",
          state: "RN",
          total_area_hectares: 100,
          arable_area_hectares: 50,
          vegetation_area_hectares: 50,
          crops: ["1"],
        },
      ],
    };

    const findedProducer = new Producer({
      name: "Old Producer Name",
      document: "123456789",
    });

    mockProducerRepository.findById.mockResolvedValue(findedProducer);
    mockProducerRepository.update.mockResolvedValue({
      responseProducer: () => ({
        id: "producer-id",
        name: "New Producer Name",
        document: "012.456.789-90",
      }),
    } as any);
    mockFarmRepository.findByProducer.mockResolvedValue([]);

    const result = await updateProducer.execute(id, input);

    expect(mockProducerRepository.findById).toHaveBeenCalledWith(id);
    expect(mockProducerRepository.update).toHaveBeenCalledWith(
      id,
      expect.any(Producer)
    );
    expect(mockFarmRepository.findByProducer).toHaveBeenCalledWith(id);
    expect(mockFarmRepository.updateMany).toHaveBeenCalledWith([expect.any(Object)]);
    expect(result.value).toEqual({
      id: "producer-id",
      name: "New Producer Name",
      document: "012.456.789-90",
    });
  });
});
