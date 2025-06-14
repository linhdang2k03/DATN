import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserResponse } from '../../../responses/user/user.response';
import { ApiResponse } from '../../../responses/common/api.response';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-account-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './update-account-user.component.html',
  styleUrl: './update-account-user.component.css'
})
export class UpdateAccountUserComponent {
  userDetail: UserResponse | null = null;  
  idCard: string = '';  
  oldPassword: string = '';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Lấy idCard từ URL để tìm thông tin người dùng
    this.idCard = this.route.snapshot.paramMap.get('idCard') || '';
    if (this.idCard) {
      this.getUserDetail(this.idCard);
    }
  }

  // Gọi API để lấy thông tin người dùng từ server
  getUserDetail(idCard: string): void {
    this.userService.getUserDetail({ idCard }).subscribe({
      next: (response: ApiResponse<UserResponse>) => {
        this.userDetail = response.body;
        if (this.userDetail) {
          // Lưu mật khẩu cũ
          this.oldPassword = this.userDetail.password ?? '';

          // Chuyển đổi định dạng birthDate từ dd/MM/yyyy sang yyyy-MM-dd
          if (this.userDetail.birthDate) {
            this.userDetail.birthDate = this.convertDateToISO(this.userDetail.birthDate);
          }
        }
      },
      error: (error) => {
        // console.error('Error fetching user detail', error);
      }
    });
  }

  // Hàm chuyển đổi từ dd/MM/yyyy sang yyyy-MM-dd
  convertDateToISO(dateString: string): string {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;  // Trả về định dạng yyyy-MM-dd
  }

  // Gửi thông tin cập nhật lên server
  updateUserDetail(): void {
    if (this.userDetail) {
      // Nếu mật khẩu mới rỗng, giữ nguyên mật khẩu cũ
      if (!this.userDetail.password || this.userDetail.password.trim() === '') {
        this.userDetail.password = this.oldPassword;
      }

      // Chuyển đổi ngày trước khi gửi lại về định dạng dd/MM/yyyy
      if (this.userDetail.birthDate) {
        this.userDetail.birthDate = this.convertDateToDisplay(this.userDetail.birthDate);
      }

      this.userService.editUser(this.userDetail).subscribe({
        next: (response) => {
          console.log('User updated successfully!');
          this.router.navigate(['/account-detail', this.userDetail!.idCard]);  
        },
        error: (error) => {
         
        }
      });
    }
  }

  // Hàm chuyển đổi từ yyyy-MM-dd sang dd/MM/yyyy để gửi về server
  convertDateToDisplay(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;  // Trả về định dạng dd/MM/yyyy
  }
  cancelUpdate(): void {
    this.router.navigate(['/account-detail', this.idCard]);
  }

  url: any = 'assets/img/avatar.png';

  onFileChanged(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event) => {
        this.url = event.target!.result;
      }
    }
  }
}
