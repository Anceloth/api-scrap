// Puerto de salida para repositorios (Output Port)
export interface OutputPort<T> {
  present(data: T): void;
}
