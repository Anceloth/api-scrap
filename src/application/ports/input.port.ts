// Puerto de entrada para casos de uso (Input Port)
export interface InputPort<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}
