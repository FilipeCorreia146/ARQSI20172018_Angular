import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from
  '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Receita } from '../models/receita';
import { Prescricao } from '../models/prescricao';
import { AuthenticationService } from './authentication.service';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

class Token { token: string };

@Injectable()
export class ReceitasService {
  private receitasUrl = 'http://localhost:8080/Receita';
  //verificar o servidor:porta
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService) { }
  getReceitas(): Observable<Receita[]> {
    return this.http.get<Receita[]>(this.receitasUrl,
      this.getHeaders());
  }
  getHeaders() {
    let headers = new HttpHeaders({
      'x-access-token':
        this.authenticationService.userInfo.token
    });

    let httpOptions = {
      headers: headers
    };
    return httpOptions;
  }
  
  getReceitaById(receita_id: string): Observable<Receita>{
    const url =  this.receitasUrl + '/' + receita_id;
    return this.http.get<Receita>(url, this.getHeaders()).pipe(
      tap((receita: Receita) => console.log(`get receita w/ id=${receita._id}`)),
      catchError(this.handleError<Receita>('getReceita'))
    );
  }


  /** POST: add a new hero to the server */
  addReceita(receita: Receita): Observable<Receita> {
    return this.http.post<Receita>(this.receitasUrl, receita, httpOptions).pipe(
      tap((receita: Receita) => console.log(`added receita w/ id=${receita._id}`)),
      catchError(this.handleError<Receita>('addReceita'))
    );
  }

  criarReceita(nomeUtente: string, farmaco: string, quantidade: string, validade: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.http.post<Token>(this.receitasUrl, {
        nomeUtente: nomeUtente,
        prescricoes: [{
          farmaco: farmaco,
          quantidade: quantidade,
          validade: validade
        }]
      }, this.getHeaders())
        .subscribe(data => {
          if (data) {

            observer.next(true);
          } else {

            observer.next(true);
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log("Client-side error occured.");
          } else {
            console.log("Server-side error occured.");
          }
          console.log(err);
          //this.authentication.next(this.userInfo);
          observer.next(false);
        });

    });
  }

  /** GET hero by id. Return `undefined` when id not found */
  getReceitaNo404<Data>(id: number): Observable<Receita> {
    const url = `${this.receitasUrl}/?id=${id}`;
    return this.http.get<Receita[]>(url)
      .pipe(
      map(receitas => receitas[0]), // returns a {0|1} element array
      tap(r => {
        const outcome = r ? `fetched` : `did not find`;
        console.log(`${outcome} receita id=${id}`);
      }),
      catchError(this.handleError<Receita>(`getReceita id=${id}`))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  /*getReceita(id: number): Observable<Receita> {
    const url = `${this.receitasUrl}/${id}`;
    return this.http.get<Receita>(url).pipe(
      tap(_ => console.log(`fetched receita id=${id}`)),
      catchError(this.handleError<Receita>(`getReceita id=${id}`))
    );
  }*/

  getReceita(id: string): Observable<Receita> {
    return this.http.get<Receita>(this.receitasUrl + '/' + id,this.getHeaders());
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getPrescricao(id:string, id_prescricao:string) : Observable<Prescricao> {

    const url =  this.receitasUrl + '/' + id + '/Prescricao/' + id_prescricao;
    return this.http.get<Prescricao>(url, this.getHeaders()).pipe(
      tap((prescricao: Prescricao) => console.log(`get prescricao w/ id=${prescricao._id}`)),
      catchError(this.handleError<Prescricao>('getPrescricao'))
    );

  }

  aviarPrescricao(id_Receita : string, id_Prescricao : string, qtd : number) : Observable<Prescricao> {

    const url = this.receitasUrl + '/' + id_Receita + '/Prescricao/' + id_Prescricao + '/Aviar';
    return this.http.put<Prescricao>(url,{quantidade: qtd},this.getHeaders()).pipe(
      tap((prescricao: Prescricao) => console.log(`Aviado w/ id=${prescricao._id}`)),
      catchError(this.handleError<Prescricao>('aviar'))
    );;

  }

  /** Log a HeroService message with the MessageService */
  /**private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }*/

}
