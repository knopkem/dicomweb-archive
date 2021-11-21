
import { IsString, IsNotEmpty } from 'class-validator';

export class WadoUriDto {
  @IsString()
  @IsNotEmpty()
  readonly studyUID: string;

  @IsString()
  @IsNotEmpty()
  readonly seriesUID: string;

  @IsString()
  @IsNotEmpty()
  readonly objectUID: string;
}