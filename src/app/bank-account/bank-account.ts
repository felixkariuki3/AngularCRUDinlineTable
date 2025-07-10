import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { Bank } from '../shared/bank';
import { subscribe } from 'diagnostics_channel';
import { BankModel } from '../shared/bank.model';
import { BankAccountService } from '../shared/bank-account';


@Component({
  selector: 'app-bank-account',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './bank-account.html',
  styleUrl: './bank-account.css'
})
export class BankAccountComponent {
  bankAccountsForm: FormGroup;
   bankList: BankModel[] = [];

  constructor(private fb: FormBuilder, 
    private bank : Bank,
    private service : BankAccountService
  ) {
    // Initialize the full form with a FormArray
    this.bankAccountsForm = this.fb.group({
      accounts: this.fb.array([])  // <- key change here
    });
    this.addBankAccountForm();  // <- initialize at least ONE form group
      this.bank.getBankList().subscribe(res => 
        this.bankList =res as []);
  }

  // Getter for easy access in template
  get accounts(): FormArray {
    return this.bankAccountsForm.get('accounts') as FormArray;
  }

  addBankAccountForm() {
    const accountForm = this.fb.group({
      bankAccountID: [0],
      accountNumber: ['', Validators.required],
      accountHolder: ['',Validators.required],
      bankID: [0,Validators.min(1)],
      IFSC: ['',Validators.required]
    });
    this.accounts.push(accountForm);
  }

  removeBankAccountForm(index: number) {
    this.accounts.removeAt(index);
  }
  recordSubmit(fg:FormGroup){
    this.service.postBankAccount(fg.value).subscribe(
    (res: any) =>{

    }
    )
  }
}
