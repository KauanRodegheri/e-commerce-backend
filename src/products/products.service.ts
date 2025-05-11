import { BadRequestException, Body, Injectable, Query } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from 'src/product_images/entities/product_image.entity';
import { OptionsDTO } from 'src/commom/dto/options.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const image = createProductDto.imageUrl;
    const productCreated = this.productRepository.create(createProductDto);
    const object = await this.productRepository.save(productCreated);

    if (image) {
      try {
        const promiseImage = image.map((image) =>
          this.productImageRepository.create({
            productId: object,
            url: image,
          }),
        );
        const imagesCreated = await Promise.all(promiseImage);
        if (Array.isArray(imagesCreated) && imagesCreated.length) {
          for (const createdImage of imagesCreated) {
            await this.productImageRepository.save(createdImage);
          }
        }
      } catch (error) {
        console.error(error);
        throw new BadRequestException('não foi possivel salvar imagem');
      }
    }

    return productCreated;
  }

  async findAllProducts(@Query() options?: OptionsDTO): Promise<Product[]> {
    const relations = Array.isArray(options?.include)
      ? options.include
      : options?.include
        ? [options.include]
        : [];

    const allProducts = await this.productRepository.find({
      ...(relations.length > 0 ? { relations } : {}),
    });

    const filters = options?.filters;

    const allProductsFiltered = filters
      ? allProducts.filter((item) => (item as any) === filters)
      : allProducts;

    return allProductsFiltered;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
