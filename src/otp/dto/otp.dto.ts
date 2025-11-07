import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class EmailDto{
	@ApiProperty({example: "pal511105@gmail.com"})
		@IsString()
	email :string
}