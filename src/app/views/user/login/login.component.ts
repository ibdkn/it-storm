import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import { HttpErrorResponse } from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {PersonService} from "../../../shared/services/person.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent {

  loginForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  })

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private personService: PersonService,
              private _snackBar: MatSnackBar,
              private router: Router) {
  }

  // Запрос на авторизацию
  login():void {
    if(this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      // делаем запрос и передаем необходимые параметры
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
        .subscribe( {
          next: (data: LoginResponseType | DefaultResponseType) => {
            let error = null;

            // Если в ответ пришел тип DefaultResponseType, сохраняем ошибку в переменную error
            if((data as DefaultResponseType).error !== undefined) {
              error = ((data as DefaultResponseType).message);
            }

            const loginResponse = data as LoginResponseType;

            // Если в ответ пришел тип LoginResponseType и нет токенов, сохраняием свою ошибку в error
            if(!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              error = 'Ошибка авторизации';
            }

            // Если ошибка сгенерировалась и в error что-то есть, выводим ошибку через snackBar и выкидываем ошибку,
            // чтобы прекратить выполнение кода
            if(error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            // Если ошибки не было, значит ответ успешный
            // Устанавливаем токены
            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;

            // оповещаем пользователя об успешной авторизации и переводим на главную страницу
            this._snackBar.open('Вы успешно авторизовались');
            this.personService.getUserInformation();
            this.router.navigate(['/']);
          },

          // обработка ответа с ошибкой
          error: (errorResponse: HttpErrorResponse) => {
            if(errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка авторизации');
            }
          }
        })
    }
  }

}
