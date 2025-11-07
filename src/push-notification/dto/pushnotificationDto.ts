import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class PushNotificationDTO {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  body: string;

  @ApiProperty()
  @IsString()
  deviceId: string;
}
