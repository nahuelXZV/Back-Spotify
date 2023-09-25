import fs = require('fs');
import path = require('path');
import { Logger } from '@nestjs/common';

import { handlerError } from './handlerError.utils';

export interface SaveFileOptions {
    pathFile: string;
    name: string;
    file: Express.Multer.File;
}

export interface DeleteFileOptions {
    pathFile: string;
    name: string;
}

export class FileSystemService {

    private static logger = new Logger('FileSystemService');

    static saveFile(option: SaveFileOptions): void {
        try {
            const { pathFile, name, file } = option;
            const imagenPath = path.join(__dirname, '..', '..', '..', 'files', pathFile);
            if (!fs.existsSync(imagenPath)) {
                fs.mkdirSync(imagenPath, { recursive: true });
            }
            fs.writeFileSync(path.join(imagenPath, name), file.buffer);
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    static deleteFile(option: DeleteFileOptions): boolean {
        try {
            const { pathFile, name } = option;
            const imagenPath = path.join(__dirname, '..', '..', '..', 'files', pathFile);
            const file = path.join(imagenPath, name);
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }
            return true;
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    static renameFile(option: SaveFileOptions): void { 
        try {
            const { pathFile, name, file } = option;
            const imagenPath = path.join(__dirname, '..', '..', '..', 'files', pathFile);
            const fileOld = path.join(imagenPath, name);
            const extension = file.originalname.split('.').pop();
            const name_file = name.split('.').shift() + '.' + extension;
            const fileNew = path.join(imagenPath, name_file);
            if (fs.existsSync(fileOld)) {
                fs.renameSync(fileOld, fileNew);
            }
        } catch (error) {
            handlerError(error, this.logger);
        }
    }
}