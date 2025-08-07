export class ScrapingException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScrapingException';
  }
}

export class InvalidUrlException extends Error {
  constructor(url: string) {
    super(`Invalid URL provided: ${url}`);
    this.name = 'InvalidUrlException';
  }
}

export class ScrapingFailedException extends Error {
  constructor(url: string, originalError: string) {
    super(`Failed to scrape URL ${url}: ${originalError}`);
    this.name = 'ScrapingFailedException';
  }
}
