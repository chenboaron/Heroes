import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const cors = require("cors");
const corsOptions = {
  origin: '*',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors(corsOptions)) // Use this after the variable declaration
  await app.listen(3000);
}
bootstrap();

