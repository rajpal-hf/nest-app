import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
try {
	const PORT = process.env.PORT ?? 5000
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe(
		{
			whitelist : true
		}
	))

	const config = new DocumentBuilder()
		.setTitle('Cats example')
		.setDescription('The cats API description')
		.setVersion('1.0')
		.addTag('cats')
		.build();
	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, documentFactory);



  await app.listen(PORT);
} catch (error) {
	console.log("bootstrap error => ", error)
	process.exit(1)
}
	
}
bootstrap();
