import { Module, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { DBConfigType } from './types/db-config.type';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { APP_PIPE } from '@nestjs/core';
import { ProductsModule } from './modules/products/products.module';
import { ProductEntity } from './entities/product.entity';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';
import { UserEntity } from './entities/user.entity';
import { OrderEntity } from './entities/order.entity';
import { CategoryEntity } from './entities/category.entity';
import { PrescriptionEntity } from './entities/prescription.entity';
import { OrderItemsEntity } from './entities/order-items.entity';
import { AuthModule } from './modules/auth/auth.module';

export function moduleFactory({
  host, password, username, port
}: DBConfigType): any {
  const dbConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'mysql',
      host: host || configService.get<string>('TYPEORM_HOST'),
      port: port || configService.get<string>('TYPEORM_PORT'),
      username: username || configService.get<string>('TYPEORM_USERNAME'),
      password: password || configService.get<string>('TYPEORM_PASSWORD'),
      database: configService.get<string>('TYPEORM_DATABASE'),
      entities: [
        ProductEntity,
        UserEntity,
        OrderEntity,
        CategoryEntity,
        PrescriptionEntity,
        OrderItemsEntity,
      ],
      synchronize: false,
      softDelete: true,
      logging: Boolean(configService.get<string>('TYPEORM_LOGGING')),
      migrationTableName: configService.get<string>('TYPEORM_MIGRATION_TABLE_NAME')
    })
  }
  @Module({
    imports: [
      ConfigModule.forRoot({
        load: [configuration],
        isGlobal: true,
      }),
      TypeOrmModule.forRootAsync(dbConfig),
      ProductsModule,
      UserModule,
      CategoryModule,
      AuthModule,
    ],
    controllers: [],
    providers: [{
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        exceptionFactory: (errors) =>
          new UnprocessableEntityException(errors),
      }),
    },
    ]
  })
  class AppModule { }
  return AppModule;
}

