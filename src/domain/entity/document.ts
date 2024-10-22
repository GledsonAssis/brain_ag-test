import Cpf from "@/domain/vo/cpf";
import Cnpj from "@/domain/vo/cnpj";

export interface DocumentResponse {
  value: string;
  type: string;
}

export default class Document {
  private readonly document: DocumentResponse;

  constructor(document: string) {
    this.document = this.defineDocument(document);
  }

  defineDocument(document: string) {
    const is_cpf = new Cpf();
    if (is_cpf.validate(document)) {
      return { type: "cpf", value: document };
    }
    const is_cnpj = new Cnpj();
    if (is_cnpj.validate(document)) {
      return { type: "cnpj", value: document };
    }
    throw new Error("Invalid Document");
  }

  getValue() {
    return this.document.value;
  }
}
