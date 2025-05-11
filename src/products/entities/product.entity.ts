import { Category } from 'src/categories/entities/category.entity';
import { Material } from 'src/commom/enum/material.enum';
import { ProductImage } from 'src/product_images/entities/product_image.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  /*@ManyToOne(() => Category, (category) => category.products, {eager: true})
  category?: Category;*/

  @Column({ type: 'int', nullable: false})
  price: number;

  @OneToMany(() => ProductImage, (image) => image.productId)
  image?: ProductImage[]
  
  @Column({ type: 'varchar', nullable: true})
  description?: string

  @Column('json')
  material?: Material[];

  /*@Column()
  size?: string;

  @Column()
  status: boolean;

  @Column()
  quantity: number;*/
}
