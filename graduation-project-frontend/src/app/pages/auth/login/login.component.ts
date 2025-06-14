import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { LocalService } from '../../../services/local.service';
import { SessionService } from '../../../services/session.service';

import { TokenService } from '../../../services/token.service';
import { LoginResponse } from '../../../responses/user/login.response';
import { UserService } from '../../../services/user.service';
import { SignInDTO } from '../../../dtos/signIn.dto';
import { UserDTO } from '../../../dtos/user.dto';
import { UserResponse } from '../../../responses/user/user.response';
import { ApiResponse } from '../../../responses/common/api.response';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  // regexId = /^\d{12}$/;

  router = inject(Router);
  http = inject(HttpClient);

  constructor(private localStore: LocalService,
    private sessionStore: SessionService,
    private tokenService: TokenService,
    private userService: UserService

  ) {
    // Khởi tạo Reactive Form
    this.loginForm = new FormGroup({
      idCard: new FormControl('', [Validators.required,]),
      password: new FormControl('', [Validators.required]),
    });
  }

  // chỗ này lấy dữ liệu từ form đăng nhập
  get idCard() {
    return this.loginForm.get('idCard');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onLogin() {
    if (this.loginForm.valid) {
      const signInDTO: SignInDTO = {
        idCard: this.idCard?.value,
        password: this.password?.value,
      }
      this.userService.signIn(signInDTO).subscribe({
        next: (res: LoginResponse) => {
          const { token } = res;
          this.tokenService.setToken(token);
          alert("Login Successful");
          this.sessionStore.set('isLogged', 'true');
          // lưu idCard nếu đăng nhập thành công 
          this.localStore.set('idCard', this.idCard?.value);
          this.setRole();
        },
        error: (error: any) => {
          alert('Incorrect account or password. Please try again!');
        }
      });
    } else {
      alert('Please fill in all required fields.'); // Thông báo nếu form không hợp lệ
    }
  }

  setRole() {
    const idCard = this.localStore.get('idCard');
    if (idCard) {
      // this.localStore.remove('role');
      const userDTO: UserDTO = { idCard };
      this.userService.getUserDetail(userDTO).subscribe({
        next: (res: ApiResponse<UserResponse>) => {
          this.localStore.set('role', String(this.convertRoleToNumber(res.body.role) || 3));
          this.router.navigateByUrl('home');
        },
        error: (err) => {
          console.error('Error:', err);
        }
      });
    }
  }

  private convertRoleToNumber(role: string): number | null {
    switch (role) {
      case 'ADMIN':
        return 1;
      case 'EDITOR':
        return 2;
      case 'VIEWER':
        return 3;
      default:
        return null;
    }
  }
}

