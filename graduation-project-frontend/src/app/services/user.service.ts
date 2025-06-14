import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { environment } from "../environments/environment";
import { UserResponse } from "../responses/user/user.response";
import { HttpService } from "./http.service";
import { SignUpDTO } from "../dtos/signUp.dto";
import { SignInDTO } from "../dtos/signIn.dto";
import { User } from "../models/user";
import { catchError, map } from "rxjs";
import { UserDTO } from "../dtos/user.dto";
import { ApiResponse } from "../responses/common/api.response";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    editUser(userDetail: UserResponse): Observable<any> {
        return this.http.put(this.apiEditUser, userDetail, this.apiConfig).pipe(
            catchError((error) => {
                console.error('Error editing user:', error);
                return throwError(error);
            })
        );
    }
    private apiSignUp = `${environment.apiBaseUrl}/user/signUp`;
    private apiSignIn = `${environment.apiBaseUrl}/user/signIn`;
    private apiGetAccountList = `${environment.apiBaseUrl}/user/getAll`;
    private apiGetUserDetail = `${environment.apiBaseUrl}/user/detail`;
    private apiEditUser = `${environment.apiBaseUrl}/user/edit`;
    private apiDeleteUser = `${environment.apiBaseUrl}/user/delete`;
    private apiFindListRole = `${environment.apiBaseUrl}/user`;


    constructor(
        private http: HttpClient,
        private httpService: HttpService
    ) { }

    private apiConfig = {
        headers: this.httpService.createHeaders(),
    }

    signUp(signUpDTO: SignUpDTO): Observable<any> {
        return this.http.post(this.apiSignUp, signUpDTO, this.apiConfig);
    }

    signIn(signInDTO: SignInDTO): Observable<any> {
        return this.http.post(this.apiSignIn, signInDTO, this.apiConfig);
    }

    saveUserResponseToLocalStorage(userResponse?: UserResponse) {
        try {
            if (userResponse == null || !userResponse) {
                return;
            }
            const userResponseJSON = JSON.stringify(userResponse);
            localStorage.setItem('user', userResponseJSON);
            console.log('User response saved to local storage.');
        } catch (error) {
            console.error('Error saving user response to local storage:', error);
        }
    }

    // Hàm này sẽ trả về tất cả List các đối tượng User
    getAccountList(page: number, size: number): Observable<UserResponse[]> {
        // Tạo đối tượng HttpParams để chứa các tham số truy vấn
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<UserResponse[]>(this.apiGetAccountList, { params });
    }

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiGetAccountList);
    }

    getAllAccount(): Observable<User[]> {
        return this.http.get<User[]>(this.apiGetAccountList);
    }
    

    // Hàm này sẽ trả về chi tiết đối tượng User sau khi đăng nhập thành công
    getUserDetail(userDTO: { idCard: string }): Observable<ApiResponse<UserResponse>> {
        return this.http.post<ApiResponse<UserResponse>>(`${this.apiGetUserDetail}`, userDTO);
    }
      
    getAccountListByRole(roleName: string): Observable<UserResponse[]> {
        return this.http.get<UserResponse[]>(`${this.apiFindListRole}/role/${roleName}`);
    }

    deleteUser(idCard: string): Observable<ApiResponse<any>> {
        const request = { idCard };  // Tạo body cho request
        return this.http.delete<ApiResponse<any>>(`${this.apiDeleteUser}`, { body: request });
      }
      
}