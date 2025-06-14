import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { SearchBarComponent } from '../../../components/search-bar/search-bar.component';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { UserResponse } from '../../../responses/user/user.response';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    SearchBarComponent,
    CommonModule,
  ],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.css'
})

export class AccountListComponent implements OnInit {
  title = 'Account';
  roleType: string = 'ALL';

  list: User[] = []; // lấy dữ liệu từ DB để lưu vào mảng này

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
  ) { }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.roleType = params['roleName']; // Lấy role từ URL
      if(this.roleType == 'ALL'){
        this.getAcountList();
      } else{
        this.getAccountListByRole(this.roleType);
      }
    });
  }

  getAcountList() {
    this.userService.getAllAccount().subscribe({
      next: (user: User[]) => {
        this.list = user;
        this.setMinMin();
      },
      error: (error: any) => {
        // console.error('Error fetching user', error);
      }
    });
  }
  filter = {
    sortBy: '',
    order: 'ascending',
    quantity: 10
  };
  sortBy = [
    {
      id: 'id',
      name: 'ID'
    },
    {
      id: 'userName',
      name: 'Name'
    },
  ];
  order = [
    {
      id: 'ascending',
      name: 'Ascending'
    },
    {
      id: 'descending',
      name: 'Descending'
    }
  ]

  minList = 0;
  maxList = this.calMax();
  isMin = false;
  isMax = false;
  indexList = 0;

  calMax() {
    return this.list.length - this.minList > 10 ? this.minList + 10 : this.list.length;
  }
  getLimited() { 
    return this.list.slice(this.minList, this.maxList); 
  }
  setMinDown() {
    this.minList -= 10;
    this.maxList = this.calMax();
    this.checkIsMin();
    this.checkIsMax();
  }
  setMinUp() {
    this.minList += 10;
    this.maxList = this.calMax();
    this.checkIsMin();
    this.checkIsMax();
  }
  setMinMin() {
    this.minList = 0;
    this.maxList = this.calMax();
    this.checkIsMin();
    this.checkIsMax();
  }
  setMinMax() {
    while(this.list.length - this.minList > 10) {
      this.minList += 10;
    }
    this.maxList = this.calMax();
    this.checkIsMin();
    this.checkIsMax();
  }
  checkIsMin() {
    this.isMin = this.minList <= 0 ? true : false;
  }
  checkIsMax() {
    this.isMax = this.maxList >= this.list.length ? true : false;
  }
  setIndex(index: number) {
    this.indexList = index;
  }
  getId() {
    return this.list[this.indexList].idCard;
  }
  getName() {
    return this.list[this.indexList].userName;
  }

  getAccountListByRole(roleName: string) {
    this.userService.getAccountListByRole(roleName).subscribe({
      next: (response: UserResponse[]) => {
        this.list = response; 
        this.setMinMin();
      },
      error: (error) => {
        
      }
    });
  }

  deleteUser(idCard: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(idCard).subscribe({
        next: (response) => {
          
          this.list = this.list.filter(user => user.idCard !== idCard);
          alert('User deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting user', error);
          alert('Failed to delete user');
        }
      });
    }
  }

  onKeywordChange(keyword: string): void {
    const lowerKeyword = keyword.toLowerCase();
    this.list = this.list.filter(item => item.userName.toLowerCase().includes(lowerKeyword));

    this.setMinMin();
  }

  applySort(): void {
    const { sortBy, order } = this.filter;

    if (!sortBy) return;

    this.list.sort((a: any, b: any) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];

      if (valueA == null || valueB == null) return 0;

      if (order === 'ascending') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });

    this.setMinMin();
  }
}
