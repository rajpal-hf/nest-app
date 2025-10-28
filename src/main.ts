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
		.setTitle('cat example')
		.setDescription('The Jadu API description')
		.setVersion('1.0')
		.addTag('Jadu')	
		.addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          description: 'Enter JWT token here (without Bearer prefix)',
          in: 'header',
        },
        'access-token',
      )
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
