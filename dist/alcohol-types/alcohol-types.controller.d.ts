import { AlcoholTypesService } from './alcohol-types.service';
import { CreateAlcoholTypeDto, UpdateAlcoholTypeDto } from './dto/alcohol-type.dto';
import { AlcoholType } from './alcohol-type.entity';
export declare class AlcoholTypesController {
    private readonly alcoholTypesService;
    constructor(alcoholTypesService: AlcoholTypesService);
    create(createDto: CreateAlcoholTypeDto): Promise<AlcoholType>;
    findAll(): Promise<AlcoholType[]>;
    findOne(id: number): Promise<AlcoholType>;
    update(id: number, updateDto: UpdateAlcoholTypeDto): Promise<AlcoholType>;
    remove(id: number): Promise<void>;
    initializeDefaultTypes(): Promise<void>;
}
