import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const createMicroserviceProvider = (name: string) => ({
  provide: `${name}`,
  useFactory: (configService: ConfigService) => {
    const port = configService.get(`${name}_SERVICE_PORT`);
    return ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        port,
      },
    });
  },
  inject: [ConfigService],
});
