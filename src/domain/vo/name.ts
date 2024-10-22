export default class Name {
  private readonly value: string;

  constructor(value: string) {
    if (!value || !RegExp(/^[\p{L}\p{M}\p{N}]+([\s\-][\p{L}\p{M}\p{N}]*)+$/u).exec(value)) throw new Error("Invalid name: The name must contain first and last name");
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}
