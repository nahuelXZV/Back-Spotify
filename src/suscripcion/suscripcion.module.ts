import { Module } from '@nestjs/common';
import { SuscripcionController } from './controllers/suscripcion.controller';
import { SuscripcionService } from './services/suscripcion.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuscripcionEntity } from './entities/suscripcion.entity';
import { UsersModule } from 'src/users/users.module';
import { SuscritoController } from './controllers/suscrito.controller';
import { SuscritoService } from './services/suscrito.service';
import { SuscritoEntity } from './entities/suscrito.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SuscripcionEntity,
      SuscritoEntity
    ]),
    UsersModule
  ],
  controllers: [SuscripcionController, SuscritoController],
  providers: [SuscripcionService, SuscritoService],
})
export class SuscripcionModule { }
