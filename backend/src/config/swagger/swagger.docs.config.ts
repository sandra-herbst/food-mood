import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('FoodMood')
  .setDescription('are you in the mood for food?')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
