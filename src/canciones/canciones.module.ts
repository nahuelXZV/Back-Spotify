import { Module } from '@nestjs/common';
import { CancionesService } from './services/canciones.service';
import { CancionesController } from './controllers/canciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CancionesEntity } from './entities/canciones.entity';
import { AlbumEntity } from './entities/album.entity';
import { GeneroEntity } from './entities/genero.entity';
import { GeneroController } from './controllers/genero.controller';
import { GeneroService } from './services/genero.service';
import { UsersModule } from 'src/users/users.module';
import { AlbumController } from './controllers/album.controller';
import { AlbumService } from './services/album.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CancionesEntity,
      AlbumEntity,
      GeneroEntity
    ]),
    UsersModule
  ],
  controllers: [CancionesController, GeneroController, AlbumController],
  providers: [CancionesService, GeneroService, AlbumService],
})
export class CancionesModule { }
