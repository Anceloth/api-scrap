// Interface for logging service
export interface ILogger {
  log(message: string, context?: string): void;
  error(message: string, trace?: string, context?: string): void;
  warn(message: string, context?: string): void;
  debug(message: string, context?: string): void;
  verbose(message: string, context?: string): void;
}

// Interface for configuration service
export interface IConfigService {
  get<T = any>(key: string, defaultValue?: T): T;
}

// Interface for encryption services
export interface IHashService {
  hash(data: string): Promise<string>;
  compare(data: string, hash: string): Promise<boolean>;
}
