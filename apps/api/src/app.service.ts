import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0',
      message: '🚀 Mon Moniteur Auto-Ecole API est opérationnel',
    };
  }

  getRoot() {
    return {
      message: 'Bienvenue à l\'API Mon Moniteur Auto-Ecole',
      documentation: '/api',
      health: '/health',
    };
  }
}
