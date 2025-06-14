import { UserService } from './../../../services/user.service';
import { UserResponse } from './../../../responses/user/user.response';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../../responses/common/api.response';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './detail-account.component.html',
  styleUrls: ['./detail-account.component.css']
})
export class AdminDetailAccountComponent implements OnInit {
  userDetail: UserResponse | null = null; 

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router : Router,
  ) {}

  ngOnInit(): void {
    const idCard = this.route.snapshot.paramMap.get('idCard'); 
    if (idCard) {
      this.getUserDetail(idCard);  
    }
  }

  // Gọi API để lấy thông tin người dùng từ backend
  getUserDetail(idCard: string): void {
    this.userService.getUserDetail({ idCard }).subscribe({
      next: (response: ApiResponse<UserResponse>) => {
        this.userDetail = response.body;
      },
      error: (error) => {
       
      }
    });
  }

  // Chuyển đổi định dạng ngày khi cần cập nhật dữ liệu và gửi lên backend
  updateUserDetail(): void {
    if (this.userDetail) {  
      this.userService.editUser(this.userDetail).subscribe({
        next: (response) => {
          console.log('User updated successfully!');
        },
        error: (error) => {
          console.error('Error updating user detail', error);
        }
      });
    } else {
      console.error('User detail is null');
    }
  }

  goToUpdate(): void {
    if (this.userDetail) {
      this.router.navigate(['/update-account', this.userDetail.idCard]);
    }
  }
  goBack(): void {
    this.router.navigate(['/account-list/ALL']);
  }
}