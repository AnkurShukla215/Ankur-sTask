import { Component, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserdetailsComponent } from './userdetails/userdetails.component';
import { MatTable } from '@angular/material/table';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { error } from 'protractor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'rxLogixProject';
  displayedColumns: string[] = ['id', 'name', 'email', 'actions'];
  @Output() valueChange = new EventEmitter();
  // dataSource = ELEMENT_DATA;
  // public user = [];
  users: any = [];
  // policies: any[] = [];
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;
  constructor(private http: HttpClient, private modalService: MatDialog, private userService: UserService) {}

  update = {
    data: '',
    val: ''
  };

  ngOnInit() {
    this.userService.getUserss()
    .subscribe(data => this.users = data);

  }

  addUser(val) {
    this.update.val = val;
    this.openModal();
  }
  openModal() {
    const modalRef = this.modalService.open(UserdetailsComponent, {
      height: 'auto',
      width: '35%',
      data: this.update,
      disableClose: true
    });
    modalRef.afterClosed().subscribe(response => {
      if (response.status === 'close' || response.status === undefined) {
      }
      if (response.status === 'add') {
        this.table.renderRows();
      }
      if (response.status === 'update') {
        this.table.renderRows();
        this.users[response.id] = response.data;
      }
    });
  }

  updateUser(val, data, id) {
    this.update.val = val;
    this.update.data = data;
    console.log(data);
    this.openModal();
  }

  getUsers() {
    this.userService.getUserss().subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.users = response.body;
        }
      },
      // tslint:disable-next-line: no-shadowed-variable
      error => {
        console.log('error:', error);
      }
      );
    }
    removeUser(val) {
      this.users.splice(val, 1);
      this.table.renderRows();
      console.log(' val._id::', val);
      console.log('length:: ', this.users.length);
      this.http.delete('http://localhost:3000/users' + '/' + val)
      .subscribe((response: any) => {
        if (response.status === 200) {
          console.log('Deleted record successfully');
        }
      // tslint:disable-next-line: no-shadowed-variable
      }, error => {
          console.log('errr::', error);
        });
    }
  }
