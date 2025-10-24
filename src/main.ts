import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
try {
	const PORT = process.env.PORT ?? 5000
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe(
		{
			whitelist : true
		}
	))
  await app.listen(PORT);
} catch (error) {
	console.log("bootstrap error => ", error)
	process.exit(1)
}
	
}
bootstrap();
