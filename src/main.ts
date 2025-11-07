import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFilter } from './all-exception.filter';
import { WsAdapter } from '@nestjs/platform-ws';
import bodyParser from 'body-parser'

async function bootstrap() {
try {
	const PORT = process.env.PORT ?? 5000
	const app = await NestFactory.create(AppModule);
	// app.enableCors({
	// 	origin: [
	// 		'*',
	// 		'http://localhost:3000',
	// 		'https://eisegetical-brenda-buzzingly.ngrok-free.dev',
	// 	],
	// 	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
	// 	allowedHeaders: ['Content-Type', 'Authorization'],
	// });

	app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }))
	
	app.enableCors({
		origin: 'http://localhost:3001',
		methods: ['GET', 'POST'],
		allowedHeaders: ['Content-Type'],
	});

	// app.enableCors({
	// 	origin: [
	// 		'*',
	// 		'https://w5k2xv.csb.app',
	// 		'http://localhost:3000',
	// 		'http://localhost:5173',
	// 		'https://eisegetical-brenda-buzzingly.ngrok-free.dev',
	// 	],
	// 	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	// 	allowedHeaders: [
	// 		'Content-Type',
	// 		'Authorization',
	// 		'ngrok-skip-browser-warning', 
	// 	],
	// 	credentials: true,
	// });
	app.useGlobalPipes(new ValidationPipe(
		{
			transform : true,
			whitelist: true
			
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
	SwaggerModule.setup('api', app, documentFactory, {
		swaggerOptions: {
			persistAuthorization : true
		}
	});

	app.useGlobalFilters(new AllExceptionFilter())
	app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(PORT);
} catch (error) {
	console.log("bootstrap error => ", error)
	process.exit(1)
}
	
}
bootstrap();
