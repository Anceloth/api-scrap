import { Table, Column, Model, DataType, PrimaryKey, Default, CreatedAt, UpdatedAt, HasMany } from 'sequelize-typescript';
import { Link } from './link.model';

@Table({
  tableName: 'urls',
  timestamps: true,
})
export class Url extends Model<Url> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  url: string;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;

  // Relationship: One URL has many Links
  @HasMany(() => Link)
  links: Link[];
}
