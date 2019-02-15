import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()         // servis koji korstimo u drugom servisu
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });
    return next.handle(authRequest);

  }
}


// da bismo ubacili "service (auth.service)" u drugi "service (auth-interceptor)" moramo da stavimo @Injectable()
// ovaj service ubacujemo drugacije u aplikaciju

// koristimo funkciju clone() da bismo izbegli greske

// .set() zapravo dodaje novi header, a ako isti header postoji onda ga pregazi
// "Bearer " je konvencija, njega obradjujemo na bekendu
// Bitan je naziv Authorization, jer se poziva na backendu ali sa lowercase ali to nema veze
// u check-auth.js funkciji

// next se obavezno poziva da bi http zahtev presao na subscribe itd. se izvrsavao


// Specijalna klasa Interceptor, klasa mora da ima intercept() metodu!!!
// radi kao middleware za odlazne zahteve
