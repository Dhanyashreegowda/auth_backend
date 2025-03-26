import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class RefreshTokenDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
