import Producer, { IProducer } from "@/domain/entity/producer";
import Name from "@/domain/vo/name";
import Document from "@/domain/entity/document";

jest.mock("@/domain/vo/name");
jest.mock("@/domain/entity/document");
jest.mock("@/domain/entity/farm");

describe("Producer", () => {
  const nameMock = "John Doe";
  const documentMock = "AB123456";

  const mockFarms = [
    { responseFarm: jest.fn().mockReturnValue({ id: "farm1", name: "Farm 1" }) },
    { responseFarm: jest.fn().mockReturnValue({ id: "farm2", name: "Farm 2" }) },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (Name.prototype.getValue as jest.Mock).mockReturnValue(nameMock);
    (Document.prototype.getValue as jest.Mock).mockReturnValue(documentMock);
  });

  it("should initialize Producer with valid IProducer data", () => {
    const producerData: IProducer = {
      id: "123",
      name: "John Doe",
      document: "AB123456",
      isActive: true,
    };

    const producer = new Producer(producerData);

    expect(producer.getId()).toBe("123");
    expect(producer.getName()).toBe("John Doe");
    expect(producer.getDocument()).toBe("AB123456");
    expect(producer.getIsActive()).toBe(true);
  });

  it("should initialize Producer with default values when isActive is not provided", () => {
    const producerData: IProducer = {
      id: "123",
      name: "John Doe",
      document: "AB123456",
    };

    const producer = new Producer(producerData);

    expect(producer.getIsActive()).toBe(true); // isActive defaults to true
  });

  it("should return responseProducer with farms data", () => {
    const producerData: IProducer = {
      id: "123",
      name: "John Doe",
      document: "AB123456",
      isActive: true,
    };

    const producer = new Producer(producerData);
    const response = producer.responseProducer(mockFarms as any[]);

    expect(response).toEqual({
      id: "123",
      name: "John Doe",
      document: "AB123456",
      farms: [
        { id: "farm1", name: "Farm 1" },
        { id: "farm2", name: "Farm 2" },
      ],
      isActive: true,
    });

    expect(mockFarms[0].responseFarm).toHaveBeenCalled();
    expect(mockFarms[1].responseFarm).toHaveBeenCalled();
  });

  it("should return responseProducer without farms when none are provided", () => {
    const producerData: IProducer = {
      id: "123",
      name: "John Doe",
      document: "AB123456",
      isActive: true,
    };

    const producer = new Producer(producerData);
    const response = producer.responseProducer();

    expect(response).toEqual({
      id: "123",
      name: "John Doe",
      document: "AB123456",
      farms: [],
      isActive: true,
    });
  });

  it("should handle undefined or empty id correctly", () => {
    const producerData: IProducer = {
      name: "John Doe",
      document: "AB123456",
    };

    const producer = new Producer(producerData);

    const response = producer.responseProducer();

    expect(response.id).toBeUndefined(); // No id provided, should be undefined
  });

  it("should handle _id field correctly as id", () => {
    const producerData: IProducer = {
      _id: "abc123",
      name: "Jane Doe",
      document: "CD987654",
      isActive: false,
    };

    const producer = new Producer(producerData);

    expect(producer.getId()).toBe("abc123");
    expect(producer.getIsActive()).toBe(false);
  });
});
