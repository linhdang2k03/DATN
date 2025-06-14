import {
    IsString,
    IsNotEmpty
} from 'class-validator'

export class SignUpDTO {
    @IsString()
    @IsNotEmpty()
    idCard: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    confirmPassword: string;

    constructor(data: any) {
        this.idCard = data.idCard;
        this.password = data.password;
        this.confirmPassword = data.confirmPassword;
    }
}