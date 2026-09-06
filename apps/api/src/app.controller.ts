import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ summary: "Vérifier la santé de l'API" })
  @ApiResponse({
    status: 200,
    description: 'API est en bonne santé',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2024-01-01T12:00:00Z',
        version: '1.0',
      },
    },
  })
  getHealth() {
    return this.appService.getHealth();
  }

  @Get()
  @ApiOperation({ summary: 'Endpoint racine' })
  @ApiResponse({
    status: 200,
    description: "Bienvenue à l'API Mon Moniteur Auto-Ecole",
  })
  getRoot() {
    return this.appService.getRoot();
  }
}
