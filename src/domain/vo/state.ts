export default class State {
  private readonly value: string;

  constructor(value: string) {
    if (!value || !this.isValidState(value))
      throw new Error(
        "Invalid state: The name must contain in list of brazilian states"
      );
    this.value = value.trim();
  }

  private isValidState(value: string): boolean {
    return [
      "AC",
      "AL",
      "AP",
      "AM",
      "BA",
      "CE",
      "DF",
      "ES",
      "GO",
      "MA",
      "MT",
      "MS",
      "MG",
      "PA",
      "PB",
      "PR",
      "PE",
      "PI",
      "RJ",
      "RN",
      "RS",
      "RO",
      "RR",
      "SC",
      "SP",
      "SE",
      "TO",
    ].includes(String(value).toLocaleUpperCase().trim());
  }

  getValue() {
    return this.value;
  }
}
