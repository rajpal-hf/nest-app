import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {

	@ApiProperty({ description: 'Receiver Id (John.bro)', example: '69043b54ab8511fb43133c35' })
	@IsNotEmpty()
	@IsString()
	receiverId: string;
	
	

	
	@ApiProperty({ description: 'Message to (John.bro)', example: 'Kya hal ae mitrrr' })
	@IsNotEmpty()
	@IsString()
	content: string;
}
