import ProducerRepository from "@/infra/repository/producer-repository";
import FarmRepository from "@/infra/repository/farm-repository";
import { DeleteProducer } from "@/application/usecases";

describe("DeleteProducer", () => {
  let deleteProducer: DeleteProducer;
  let mockProducerRepository: jest.Mocked<ProducerRepository>;
  let mockFarmRepository: jest.Mocked<FarmRepository>;

  beforeEach(() => {
    mockProducerRepository = {
      findById: jest.fn(),
      deleteById: jest.fn(),
    } as unknown as jest.Mocked<ProducerRepository>;

    mockFarmRepository = {
      deleteByProducerId: jest.fn(),
    } as unknown as jest.Mocked<FarmRepository>;

    deleteProducer = new DeleteProducer();
    deleteProducer.producerRepository = mockProducerRepository;
    deleteProducer.farmRepository = mockFarmRepository;
  });

  it("deve remover com sucesso um produtor e suas fazendas", async () => {
    const idProducer = "valid-producer-id";

    mockProducerRepository.findById.mockResolvedValueOnce({ id: idProducer } as any);
    mockFarmRepository.deleteByProducerId.mockResolvedValueOnce(undefined);
    mockProducerRepository.deleteById.mockResolvedValueOnce(undefined);

    const result = await deleteProducer.execute(idProducer);

    expect(mockProducerRepository.findById).toHaveBeenCalledWith(idProducer);
    expect(mockFarmRepository.deleteByProducerId).toHaveBeenCalledWith(idProducer);
    expect(mockProducerRepository.deleteById).toHaveBeenCalledWith(idProducer);
    expect(result).toEqual({ value: { data: `Id ${idProducer} removed with success` } });
  });

  it("deve lançar erro se o produtor não for encontrado", async () => {
    const idProducer = "invalid-producer-id";
    mockProducerRepository.findById.mockRejectedValueOnce(new Error("Producer not found"));

    await expect(deleteProducer.execute(idProducer)).rejects.toThrow("Producer not found");
    expect(mockProducerRepository.findById).toHaveBeenCalledWith(idProducer);
    expect(mockFarmRepository.deleteByProducerId).not.toHaveBeenCalled();
    expect(mockProducerRepository.deleteById).not.toHaveBeenCalled();
  });

  it("deve lançar erro se falhar ao deletar as fazendas associadas", async () => {
    const idProducer = "valid-producer-id";

    mockProducerRepository.findById.mockResolvedValueOnce({ id: idProducer } as any);
    mockFarmRepository.deleteByProducerId.mockRejectedValueOnce(new Error("Failed to delete farms"));

    await expect(deleteProducer.execute(idProducer)).rejects.toThrow("Failed to delete farms");

    expect(mockProducerRepository.findById).toHaveBeenCalledWith(idProducer);
    expect(mockFarmRepository.deleteByProducerId).toHaveBeenCalledWith(idProducer);
    expect(mockProducerRepository.deleteById).not.toHaveBeenCalled();
  });

  it("deve lançar erro se falhar ao deletar o produtor após remover as fazendas", async () => {
    const idProducer = "valid-producer-id";

    mockProducerRepository.findById.mockResolvedValueOnce({ id: idProducer } as any);
    mockFarmRepository.deleteByProducerId.mockResolvedValueOnce(undefined);
    mockProducerRepository.deleteById.mockRejectedValueOnce(new Error("Failed to delete producer"));

    await expect(deleteProducer.execute(idProducer)).rejects.toThrow("Failed to delete producer");

    expect(mockProducerRepository.findById).toHaveBeenCalledWith(idProducer);
    expect(mockFarmRepository.deleteByProducerId).toHaveBeenCalledWith(idProducer);
    expect(mockProducerRepository.deleteById).toHaveBeenCalledWith(idProducer);
  });
});
