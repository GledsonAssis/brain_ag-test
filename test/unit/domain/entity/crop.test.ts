import Crop, { ICrop } from "@/domain/entity/crop";

describe("Crop", () => {
  it("should initialize with valid ICrop data", () => {
    const cropData: ICrop = { id: "123", name: "Wheat" };
    const crop = new Crop(cropData);

    expect(crop.getId()).toBe("123");
    expect(crop.getName()).toBe("Wheat");
  });

  it("should initialize with only an id if name is not provided", () => {
    const cropData: ICrop = { id: "123" };
    const crop = new Crop(cropData);

    expect(crop.getId()).toBe("123");
    expect(crop.getName()).toBeUndefined(); // name is optional
  });

  it("should return a valid responseCrop object", () => {
    const cropData: ICrop = { id: "123", name: "Wheat" };
    const crop = new Crop(cropData);

    const response = crop.responseCrop();

    expect(response).toEqual({
      id: "123",
      name: "Wheat",
    });
  });

  it("should return responseCrop with name undefined when name is not provided", () => {
    const cropData: ICrop = { id: "123" };
    const crop = new Crop(cropData);

    const response = crop.responseCrop();

    expect(response).toEqual({
      id: "123",
      name: undefined,
    });
  });
});
