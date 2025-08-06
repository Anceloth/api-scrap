import { Table, Column, Model, DataType, PrimaryKey, Default, CreatedAt, UpdatedAt, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Url } from './url.model';

@Table({
  tableName: 'links',
  timestamps: true,
})
export class Link extends Model<Link> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => Url)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  urlId: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  link: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;

  // Relationship: Many Links belong to one URL
  @BelongsTo(() => Url)
  url: Url;
}
