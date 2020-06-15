import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.css']
})
export class UserdetailsComponent implements OnInit {
  resData = {
    status: 'close', // 'close' when closed; 'add' to add form value, 'update' to update form value
    data: ''
  };
  productForm: FormGroup;
  user: User;
  // tslint:disable-next-line: no-output-native
  @Output() change = new EventEmitter();


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) private modal: MatDialogClose,
    private formBuider: FormBuilder,
    private dialogRef: MatDialogRef<any>,
    private httpService: UserService
  ) { }

  ngOnInit() {
    this.createUserForm();
    if (this.data.val === true) {
      const newVal = Object.assign({}, this.data.data);
      console.log(newVal);
      delete newVal.__V;
      delete newVal.createDate;
      delete newVal.updateDate;
      console.log(newVal);
      this.productForm.patchValue(newVal);
    }
  }
  createUserForm() {
    this.productForm = this.formBuider.group({
      id: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required]]
    });
  }
  save() {
    const finalVal = this.productForm.value;
    delete finalVal._id;
    delete finalVal.updateDate;
    this.httpService.createNewSection(finalVal)
      .subscribe((response: any) => {
        if (response.status === 201) {
          this.resData.status = 'add';
          this.resData.data = response.body.user;
          this.dialogRef.close(this.resData);
        }
      }, error => {
        console.log('error', error);
      });
  }


  update() {
    const finaVal: User = Object.assign({}, this.productForm.value);
    this.httpService.updateUser(finaVal, finaVal.id)
      .subscribe((response: any) => {
        if (response.status === 201) {
          this.resData.status = 'update';
          this.dialogRef.close(this.resData);
        }
      },
        error => {
          console.log('error', error);
        });
  }


  close() {
    this.resData.status = 'close';
    this.dialogRef.close(this.resData);
  }
}
