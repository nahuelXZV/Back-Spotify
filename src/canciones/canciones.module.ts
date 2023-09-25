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
import { VersionController } from './controllers/version.controller';
import { VersionService } from './services/version.service';
import { VersionEntity } from './entities/version.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CancionesEntity,
      AlbumEntity,
      GeneroEntity,
      VersionEntity
    ]),
    UsersModule
  ],
  controllers: [CancionesController, GeneroController, AlbumController, VersionController],
  providers: [CancionesService, GeneroService, AlbumService, VersionService],
})
export class CancionesModule { }
