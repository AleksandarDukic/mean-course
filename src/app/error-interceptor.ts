import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';    // koristi komponentu kao sadrzaj, komponentu koju mi pravimo
import { ErrorComponent } from './error/error.component'; // ovo je ta komponenta

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(                   // handle() gives us back the response observable stream !!!!
      catchError((error: HttpErrorResponse) => {    // and we can hook to the stream and listen to response
        let errorMessage = 'An unknown error occured!';
        if (error.error.message){
          errorMessage = error.error.message;
        }
        this.dialog.open(ErrorComponent, { data: { message: errorMessage }});
        return throwError(error);
                                  // throwError je observable koju vracamo iniciranom http zahtevu
      })
    );
  }
}
