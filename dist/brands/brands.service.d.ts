import { Repository } from 'typeorm';
import { Brand } from './brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
export declare class BrandsService {
    private brandsRepository;
    constructor(brandsRepository: Repository<Brand>);
    create(createBrandDto: CreateBrandDto): Promise<Brand>;
    findAll(): Promise<Brand[]>;
    findByAlcoholType(alcoholTypeId: number): Promise<Brand[]>;
    findOne(id: number): Promise<Brand>;
    update(id: number, updateBrandDto: UpdateBrandDto): Promise<Brand>;
    remove(id: number): Promise<void>;
    getPriceForSize(brandId: number, size: string): Promise<number | null>;
}
