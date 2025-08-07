import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Url } from '../../database/models/url.model';
import { UrlRepository } from '../../../application/ports/url-repository.port';

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
}
