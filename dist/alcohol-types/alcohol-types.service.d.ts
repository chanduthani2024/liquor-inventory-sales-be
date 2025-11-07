import { Repository } from 'typeorm';
import { AlcoholType } from './alcohol-type.entity';
import { CreateAlcoholTypeDto, UpdateAlcoholTypeDto } from './dto/alcohol-type.dto';
export declare class AlcoholTypesService {
    private alcoholTypeRepository;
    constructor(alcoholTypeRepository: Repository<AlcoholType>);
    create(createDto: CreateAlcoholTypeDto): Promise<AlcoholType>;
    findAll(): Promise<AlcoholType[]>;
    findOne(id: number): Promise<AlcoholType>;
    update(id: number, updateDto: UpdateAlcoholTypeDto): Promise<AlcoholType>;
    remove(id: number): Promise<void>;
    initializeDefaultTypes(): Promise<void>;
}
