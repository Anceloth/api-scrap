export interface LinkRepository {
  createMany(linksData: Array<{
    urlId: string;
    link: string;
    name: string;
  }>): Promise<Array<{
    id: string;
    urlId: string;
    link: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }>>;
  
  deleteByUrlId(urlId: string): Promise<void>;

  findByUrl(options: {
    url: string;
    page: number;
    limit: number;
  }): Promise<{
    links: Array<{
      id: string;
      urlId: string;
      link: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
    total: number;
  }>;
}
