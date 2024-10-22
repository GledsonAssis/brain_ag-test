export default class HectaresArea {
  private readonly total_area_hectares: number;
  private readonly arable_area_hectares: number;
  private readonly vegetation_area_hectares: number;

  constructor(
    total_area_hectares: number,
    arable_area_hectares: number,
    vegetation_area_hectares: number
  ) {
    if (
      !total_area_hectares ||
      !this.isInvalidTotal(
        total_area_hectares,
        arable_area_hectares,
        vegetation_area_hectares
      )
    ) {
      throw new Error("Invalid totals");
    }
    this.total_area_hectares = total_area_hectares;
    this.arable_area_hectares = arable_area_hectares;
    this.vegetation_area_hectares = vegetation_area_hectares;
  }

  private isInvalidTotal(
    total_area_hectares: number,
    arable_area_hectares: number,
    vegetation_area_hectares: number
  ): boolean {
    return (
      (arable_area_hectares + vegetation_area_hectares).toFixed(4) ===
      total_area_hectares.toFixed(4)
    );
  }

  getTotalAreaHectares() {
    return this.total_area_hectares;
  }
  getArableAreaHectares() {
    return this.arable_area_hectares;
  }
  getVegetationAreaHectares() {
    return this.vegetation_area_hectares;
  }
}
