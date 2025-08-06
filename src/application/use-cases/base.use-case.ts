// Caso de uso base para la arquitectura hexagonal
import { InputPort } from '../ports/input.port';

export abstract class BaseUseCase<TInput, TOutput> implements InputPort<TInput, TOutput> {
  abstract execute(input: TInput): Promise<TOutput>;
}
