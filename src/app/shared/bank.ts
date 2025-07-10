import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { provideHttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Bank {

  constructor(private http : HttpClient) { }
  getBankList(){
return this.http.get(environment.apiUrl+'/Banks');
  }
}
