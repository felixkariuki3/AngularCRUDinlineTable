import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { provideHttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {

  constructor(private http : HttpClient) {}
    postBankAccount(formData :any){
      return this.http.post(environment.apiUrl+'/BankAccount',formData)
    }
    putBankAccount(formData :any){
      return this.http.put(environment.apiUrl+'/BankAccount/'+formData.bankAccountID,formData)
    }
    deleteBankAccount(id: number){
      return this.http.delete(environment.apiUrl+'/BankAccount/'+id);
    }
    getBankAccountList(){
      return this.http.get(environment.apiUrl+'/BankAccount')
    }
   
}
