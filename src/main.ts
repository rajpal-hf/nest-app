import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFilter } from './all-exception.filter';

async function bootstrap() {
try {
	const PORT = process.env.PORT ?? 5000
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	app.useGlobalPipes(new ValidationPipe(
		{
			whitelist : true
		}
	))

	const config = new DocumentBuilder()
		.setTitle('nest auth example')
		.setDescription('The auth API description')
		.setVersion('1.0')
		.addTag('Auth')	
		.addBearerAuth()
		.build();
	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, documentFactory);

	app.useGlobalFilters( new AllExceptionFilter())

  await app.listen(PORT);
} catch (error) {
	console.log("bootstrap error => ", error)
	process.exit(1)
}
	
}
bootstrap();
