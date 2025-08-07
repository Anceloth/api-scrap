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
}
