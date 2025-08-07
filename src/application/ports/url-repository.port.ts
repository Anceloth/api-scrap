export interface UrlRepository {
  create(urlData: { name: string; url: string }): Promise<{
    id: string;
    name: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  
  findByUrl(url: string): Promise<{
    id: string;
    name: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
  } | null>;

  findAllWithLinksCount(options: {
    page: number;
    limit: number;
  }): Promise<{
    urls: Array<{
      id: string;
      name: string;
      url: string;
      linksCount: number;
      createdAt: Date;
      updatedAt: Date;
    }>;
    total: number;
  }>;
}
