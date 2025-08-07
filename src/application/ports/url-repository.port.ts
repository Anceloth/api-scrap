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
}
