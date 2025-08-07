import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Link } from '../../database/models/link.model';
import { LinkRepository } from '../../../application/ports/link-repository.port';

@Injectable()
export class SequelizeLinkRepository implements LinkRepository {
  constructor(
    @InjectModel(Link)
    private readonly linkModel: typeof Link,
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
}
