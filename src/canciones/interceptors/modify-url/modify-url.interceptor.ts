import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ModifyUrlInterceptor implements NestInterceptor {

  constructor(private readonly pathFile: string) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data.length > 0) {
          data.forEach((element) => {
            element.imagen = `${process.env.APP_URL}/api/files/${this.pathFile}/${element.imagen}`;
          });
        } else {
          data.imagen = `${process.env.APP_URL}/api/files/${this.pathFile}/${data.imagen}`;
        }
        return data;
      }),
    );
  }
}
