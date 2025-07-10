import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { Bank } from '../shared/bank';
import { subscribe } from 'diagnostics_channel';
import { BankModel } from '../shared/bank.model';
import { BankAccountService } from '../shared/bank-account.service';
import { catchError } from 'rxjs';




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
  notification :{ class:string, message: string }| null = null;

  constructor(private fb: FormBuilder, 
    private bank : Bank,
    private service : BankAccountService
  ) {
    // Initialize the full form with a FormArray
    this.bankAccountsForm = this.fb.group({
      accounts: this.fb.array([])  // <- key change here
    });
      // <- initialize at least ONE form group
      this.bank.getBankList().subscribe(res => 
        this.bankList =res as []);

      //Loads the list of banks from the API
        this.service.getBankAccountList().subscribe((res:any) =>{
          
          console.log('Raw bank accounts from API:', res);
          this.accounts.clear();
      if (res.length==0)
        this.addBankAccountForm();
      else {
            (res as []).forEach ((bankAccount :any)=>{
              const realId = bankAccount.bankAccountID ?? bankAccount.bankAccountId ?? 0;
              console.log('Mapping bankAccountID →', realId);
              const accountForm = this.fb.group({
      bankAccountID: [bankAccount.bankAccountId],
      accountNumber: [bankAccount.accountNumber, Validators.required],
      accountHolder: [bankAccount.accountHolder,Validators.required],
      bankID: [bankAccount.bankID,Validators.min(1)],
      IFSC: [bankAccount.ifsc,Validators.required]
    });
    this.accounts.push(accountForm);

            })
      }
        })
  }

  // Getter for easy access in template
  get accounts(): FormArray {
    return this.bankAccountsForm.get('accounts') as FormArray;
  }
  //Retrieves a specific Formgroup by index
  getAccountFormGroup(index: number): FormGroup {
  return this.accounts.at(index) as FormGroup;
}

//Pushes accounts to the API
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
//Removes a row in a form
  removeBankAccountForm(index: number) {
    this.accounts.removeAt(index);
  }

//Posts and updates an account to the API
  recordSubmit(fg:FormGroup){
    const id= Number(fg.value.bankAccountID)
    console.log('Form submitted:', fg.value);

    if (!id || id === 0)
    this.service.postBankAccount(fg.value).subscribe(
     (res: any) => {
      console.log('API response:', res);
      //Patch the response from the API back to the bankAccountID
      fg.patchValue({bankAccountID: res.bankAccountId});
      console.log('Server response:', res);
      this.showNotifications('insert');
    })
      
    else 
    //Updates an existing record
       this.service.putBankAccount(fg.value).subscribe(
     (res: any) => {
      
    this.showNotifications('update');
    });
  }
  //Deletes an account and Removes the row from the form
 onDelete(fg: FormGroup, i: number) {
  const id = fg.get('bankAccountID')!.value as number;
   console.log('Attempting delete for ID:', id, 'at index', i);
   //Makes sure that the ID exist before calling the API especially when the response is delayed.
  if (id && id > 0) {
    (confirm('Are you sure you want delete?'))
    this.service.deleteBankAccount(id).subscribe({
      next: () => {
        console.log('Server delete succeeded for ID:', id);
        //Remove the line from the Form
        this.accounts.removeAt(i);
        this.showNotifications('delete');
      }})}

    else {
  // new row → just remove locally
    console.log('Removing new, unsaved row at index', i);
    this.accounts.removeAt(i);}
  }
  //Define the notifications for the above CRUD operations
  showNotifications(category:string){
    switch (category){
      case 'insert':
        this.notification ={class:'text-success', message:'Saved'}
      break;
      case 'update':
        this.notification ={class:'text-primary', message:'Updated'}
      break;
      case 'delete':
        this.notification ={class:'text-danger', message:'Deleted'}
      break;

      default:
      break;
    }
    setTimeout(() => {
      this.notification =null;
    }, 3000);
  }
   
}
