import { IsString, IsNotEmpty } from 'class-validator';

export class StudyDto {
  @IsString()
  @IsNotEmpty()
  readonly studyInstanceUid: string;
}
