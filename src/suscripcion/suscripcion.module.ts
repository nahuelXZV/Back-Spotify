import { Module } from '@nestjs/common';
import { SuscripcionController } from './controllers/suscripcion.controller';
import { SuscripcionService } from './services/suscripcion.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuscripcionEntity } from './entities/suscripcion.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SuscripcionEntity
    ]),
    UsersModule
  ],
  controllers: [SuscripcionController],
  providers: [SuscripcionService],
})
export class SuscripcionModule { }
