// Base Value Object para la arquitectura hexagonal
export abstract class ValueObject<T> {
  public readonly value: T;

  constructor(value: T) {
    this.value = value;
    this.validate();
  }

  protected abstract validate(): void;

  equals(other: ValueObject<T>): boolean {
    return JSON.stringify(this.value) === JSON.stringify(other.value);
  }
}
