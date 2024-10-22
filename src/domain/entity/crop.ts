export interface ICrop {
  id: string;
  name?: string;
}

export default class Crop {
  private readonly id: string;
  private readonly name?: string;

  constructor(crop: ICrop) {
    this.id = crop.id;
    this.name = crop.name;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }
  responseCrop() {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
