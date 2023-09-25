import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FileService {


    getStaticProductImage(pathFile: string, imageName: string) {
        const path = join(__dirname, '..', '..', 'files', pathFile, imageName);
        console.log(path);
        if (!existsSync(path))
            throw new BadRequestException(`No product found with image ${imageName}`);
        return path;
    }

}
