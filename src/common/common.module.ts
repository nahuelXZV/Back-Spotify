import { Global, Module } from '@nestjs/common';
import { FileSystemService } from './utils/fileSystem.utils';

@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [FileSystemService],
    exports: [FileSystemService],
})
export class CommonModule {}
