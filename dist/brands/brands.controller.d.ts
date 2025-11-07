import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
export declare class BrandsController {
    private readonly brandsService;
    constructor(brandsService: BrandsService);
    create(createBrandDto: CreateBrandDto): Promise<{
        success: boolean;
        message: string;
        data: import("./brand.entity").Brand;
    }>;
    findAll(): Promise<import("./brand.entity").Brand[]>;
    findOne(id: string): Promise<import("./brand.entity").Brand>;
    update(id: string, updateBrandDto: UpdateBrandDto): Promise<{
        success: boolean;
        message: string;
        data: import("./brand.entity").Brand;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    findByAlcoholType(alcoholTypeId: string): Promise<import("./brand.entity").Brand[]>;
    getPriceForSize(id: string, size: string): Promise<number>;
}
