import { Component } from '@angular/core';
import { ApiResponse } from '../../../responses/common/api.response';
import { UserResponse } from '../../../responses/user/user.response';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail-account-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './detail-account.component.html',
  styleUrl: './detail-account.component.css'
})
export class DetailAccountUserComponent {
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
        console.error('Error fetching user detail', error);
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
      this.router.navigate(['/account-update', this.userDetail.idCard]); 
    }
  }
  goBack(): void {
    this.router.navigate(['/account-list']); 
  }
}
