import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { provideHttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {

  constructor(private http : HttpClient) {

  }
    postBankAccount(formData :FormData){
      return this.http.post(environment.apiUrl +'/BankAccounts',formData)
    }
   
}
