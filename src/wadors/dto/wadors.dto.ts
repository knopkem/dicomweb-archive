
import { IsString, IsNotEmpty } from 'class-validator';

export class WadoRsDto {
  @IsString()
  @IsNotEmpty()
  readonly studyInstanceUid: string;

  @IsString()
  @IsNotEmpty()
  readonly seriesInstanceUid: string;

  @IsString()
  @IsNotEmpty()
  readonly sopInstanceUid: string;
}