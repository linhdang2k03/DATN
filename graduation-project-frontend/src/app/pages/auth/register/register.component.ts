import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { SignUpDTO } from '../../../dtos/signUp.dto';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  // router = inject(Router);
  // http = inject(HttpClient);

  // regexIdCard = /^\d{12}$/;
  regexPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,}).+$/;

  constructor(private http: HttpClient, private router: Router, private userService: UserService) {
    this.registerForm = new FormGroup({
      idCard: new FormControl('', [
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(this.regexPassword),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
      ]),
    }, { validators: this.passwordMatchValidator });
  }

  // Validator tùy chỉnh để kiểm tra mật khẩu và mật khẩu xác nhận có khớp
  passwordMatchValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // chỗ này lấy dữ liệu từ form đăng ký 
  get idCard() {
    return this.registerForm.get('idCard');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  onRegister() {
    if (this.registerForm.valid) {
      const signUpDTO: SignUpDTO = {
        idCard: this.idCard?.value,
        password: this.password?.value,
        confirmPassword: this.confirmPassword?.value
      }

      this.userService.signUp(signUpDTO).subscribe({
        next: (res: any) => {
          alert("Register Successfully")
          this.router.navigate(['/login']);
        },
        complete: () => {
        },
        error: (error: any) => {
          alert(`Cannot register, error: ${error.error}`)
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields and ensure passwords match.';
    }
  }
}

interface RegisterResponse {
  result: boolean;
  message: string;
}
