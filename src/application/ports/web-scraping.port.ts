export interface ScrapedLink {
  link: string;
  name: string;
}

export interface ScrapingResult {
  title: string;
  links: ScrapedLink[];
}

export interface WebScrapingPort {
  scrapeUrl(url: string): Promise<ScrapingResult>;
}
