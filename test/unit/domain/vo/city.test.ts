import City from "@/domain/vo/city";

describe("City", () => {
  it("should return the correct value when initialized with a valid string", () => {
    const cityName = "New York";
    const city = new City(cityName);
    expect(city.getValue()).toBe(cityName);
  });

  it("should return an empty string when initialized with an empty string", () => {
    const cityName = "";
    const city = new City(cityName);
    expect(city.getValue()).toBe(cityName);
  });

  it("should return the correct value when initialized with a valid string", () => {
    const cityName = "New York";
    const city = new City(cityName);
    expect(city.getValue()).toBe(cityName);
  });
});
