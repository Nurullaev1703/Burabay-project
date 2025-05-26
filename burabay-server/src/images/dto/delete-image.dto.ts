import { IsString } from 'class-validator';

export class DeleteFileDto {
  @IsString()
  filepath: string;
}
