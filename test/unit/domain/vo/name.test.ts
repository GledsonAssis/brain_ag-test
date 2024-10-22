import Name from "@/domain/vo/name";

describe('Name', () => {

    it('should create a Name object when given a valid first and last name', () => {
      const name = new Name('John Doe');
      expect(name.getValue()).toBe('John Doe');
    });

    it('should throw an error when given an empty string', () => {
      expect(() => new Name('')).toThrow('Invalid name: The name must contain first and last name');
    });

    it('should return the correct value when getValue is called', () => {
        const name = new Name('John Doe');
        expect(name.getValue()).toBe('John Doe');
    });

    it('should throw an error when creating a Name object with only a first name', () => {
      expect(() => new Name('John')).toThrow("Invalid name: The name must contain first and last name");
    });

    it('should throw an error when creating a Name object with only a last name', () => {
      expect(() => new Name('Doe')).toThrow("Invalid name: The name must contain first and last name");
    });

    it('should throw an error when creating a Name object with special characters in the name', () => {
      expect(() => new Name('John@Doe')).toThrow("Invalid name: The name must contain first and last name");
    });

    it('should create a Name object with multiple spaces between names', () => {
        const name = new Name('John    Doe');
        expect(name.getValue()).toBe('John    Doe');
    });

    it('should create a Name object with hyphens in the name', () => {
      const name = new Name('John-Doe');
      expect(name.getValue()).toBe('John-Doe');
    });
});
