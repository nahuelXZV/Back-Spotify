import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './config/data.source';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProvidersModule } from './providers/providers.module';
import { CommonModule } from './common/common.module';
import { SeederModule } from './seeder/seeder.module';
import { CancionesModule } from './canciones/canciones.module';
import { FileModule } from './file/file.module';
import { SuscripcionModule } from './suscripcion/suscripcion.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({ ...DataSourceConfig }),
    UsersModule,
    AuthModule,
    CommonModule,
    ProvidersModule,
    SeederModule,
    CancionesModule,
    FileModule,
    SuscripcionModule,
  ],
})
export class AppModule {}
