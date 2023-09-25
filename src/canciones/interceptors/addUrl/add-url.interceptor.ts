import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class AddUrlInterceptor implements NestInterceptor {

    constructor(private readonly pathFile: string) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                if (data.length > 0) {
                    data.forEach((element) => {
                        element.url_cancion = `${process.env.APP_URL}/api/files/${this.pathFile}/${element.nombre_cancion}`;
                    });
                } else {
                    data.url_cancion = `${process.env.APP_URL}/api/files/${this.pathFile}/${data.nombre_cancion}`;
                }
                return data;
            }),
        );
    }
}
