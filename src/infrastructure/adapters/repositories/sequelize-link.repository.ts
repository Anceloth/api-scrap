import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Link } from '../../database/models/link.model';
import { Url } from '../../database/models/url.model';
import { LinkRepository } from '../../../application/ports/link-repository.port';

@Injectable()
export class SequelizeLinkRepository implements LinkRepository {
  constructor(
    @InjectModel(Link)
    private readonly linkModel: typeof Link,
    @InjectModel(Url)
    private readonly urlModel: typeof Url,
  ) {}

  async createMany(linksData: Array<{
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
  }>> {
    const links = await this.linkModel.bulkCreate(linksData);
    return links.map(link => ({
      id: link.id,
      urlId: link.urlId,
      link: link.link,
      name: link.name,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
    }));
  }

  async deleteByUrlId(urlId: string): Promise<void> {
    await this.linkModel.destroy({
      where: { urlId },
    });
  }

  async findByUrl(options: {
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
  }> {
    const offset = (options.page - 1) * options.limit;

    // First, find the URL to get its ID
    const urlRecord = await this.urlModel.findOne({
      where: { url: options.url },
    });

    if (!urlRecord) {
      return {
        links: [],
        total: 0,
      };
    }

    const { count, rows } = await this.linkModel.findAndCountAll({
      where: { urlId: urlRecord.id },
      limit: options.limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      links: rows.map(link => ({
        id: link.id,
        urlId: link.urlId,
        link: link.link,
        name: link.name,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt,
      })),
      total: count,
    };
  }
}
