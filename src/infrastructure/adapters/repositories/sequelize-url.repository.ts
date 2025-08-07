import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Url } from '../../database/models/url.model';
import { UrlRepository } from '../../../application/ports/url-repository.port';
import { QueryTypes } from 'sequelize';

@Injectable()
export class SequelizeUrlRepository implements UrlRepository {
  constructor(
    @InjectModel(Url)
    private readonly urlModel: typeof Url,
  ) {}

  async create(urlData: { name: string; url: string }): Promise<{
    id: string;
    name: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
  }> {
    const url = await this.urlModel.create(urlData);
    return {
      id: url.id,
      name: url.name,
      url: url.url,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    };
  }

  async findByUrl(url: string): Promise<{
    id: string;
    name: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
  } | null> {
    const found = await this.urlModel.findOne({
      where: { url },
    });

    if (!found) {
      return null;
    }

    return {
      id: found.id,
      name: found.name,
      url: found.url,
      createdAt: found.createdAt,
      updatedAt: found.updatedAt,
    };
  }

  async findAllWithLinksCount(options: {
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
  }> {
    const { page, limit } = options;
    const offset = (page - 1) * limit;

    // Get total count
    const totalCount = await this.urlModel.count();

    // Get URLs with links count using raw query for better performance
    const query = `
      SELECT 
        u.id,
        u.name,
        u.url,
        u."createdAt",
        u."updatedAt",
        COALESCE(link_counts.links_count, 0) as "linksCount"
      FROM urls u
      LEFT JOIN (
        SELECT 
          "urlId",
          COUNT(*) as links_count
        FROM links
        GROUP BY "urlId"
      ) link_counts ON u.id = link_counts."urlId"
      ORDER BY u."createdAt" DESC
      LIMIT :limit OFFSET :offset
    `;

    const urls = await this.urlModel.sequelize.query(query, {
      replacements: { limit, offset },
      type: QueryTypes.SELECT,
    });

    return {
      urls: (urls as any[]).map((url: any) => ({
        id: url.id,
        name: url.name,
        url: url.url,
        linksCount: parseInt(url.linksCount, 10),
        createdAt: url.createdAt,
        updatedAt: url.updatedAt,
      })),
      total: totalCount,
    };
  }
}
