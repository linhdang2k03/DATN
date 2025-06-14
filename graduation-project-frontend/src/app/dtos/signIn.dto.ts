import {
    IsString,
    IsNotEmpty
} from 'class-validator'

export class SignInDTO {
    @IsString()
    @IsNotEmpty()
    idCard: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    constructor(data: any) {
        this.idCard = data.idCard;
        this.password = data.password;
    }
}