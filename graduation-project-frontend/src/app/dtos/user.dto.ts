import {
    IsString,
    IsNotEmpty
} from 'class-validator'

export class UserDTO {
    @IsString()
    @IsNotEmpty()
    idCard: string;

    constructor(data: any) {
        this.idCard = data.idCard;
    }
}