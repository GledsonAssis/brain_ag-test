import Document from "@/domain/entity/document";
import Farm from "@/domain/entity/farm";
import Name from "@/domain/vo/name";

export interface IProducer {
  _id?: string;
  id?: string;
  name: string;
  document: string;
  isActive?: boolean;
}

export default class Producer {
  private readonly id: string = "";
  private readonly name: Name;
  private readonly document: Document;
  private readonly isActive: boolean;

  constructor(user: IProducer) {
    this.id = String(user?._id ?? user?.id ?? "");
    this.name = new Name(user?.name);
    this.document = new Document(user?.document);
    this.isActive = "isActive" in user ? Boolean(user.isActive) : true;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name.getValue();
  }

  getDocument() {
    return this.document.getValue();
  }

  getIsActive() {
    return this.isActive;
  }

  responseProducer(farms: Farm[] = []) {
    return {
      id: this.id || undefined,
      name: this.name.getValue(),
      document: this.document.getValue(),
      farms: farms.map(farm => farm.responseFarm()),
      isActive: this.isActive,
    };
  }
}
