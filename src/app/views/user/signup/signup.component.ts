import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {LoginResponseType} from "../../../../types/login-response.type";
import { HttpErrorResponse } from "@angular/common/http";
import {PersonService} from "../../../shared/services/person.service";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    standalone: false
})
export class SignupComponent {

  signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^([А-ЯA-z]{1}[а-яa-z]{1,19})+(\s+([А-ЯA-z]{1}[а-яa-z]{1,19})+)?$/)]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)]],
    agree: [false, [Validators.requiredTrue]],
  });


  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private personService: PersonService,
              private router: Router) {
  }


  // Функция регистарции нового пользователя
  signup() {

    // Если форма валидна и все поля заполнены, делаем запрос на регистрацию и передаем данные
    if(this.signupForm.valid && this.signupForm.value.name && this.signupForm.value.email && this.signupForm.value.password && this.signupForm.value.agree) {
      this.authService.signup(this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.password)
        .subscribe({
          next: (data: DefaultResponseType | LoginResponseType) => {
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
            this._snackBar.open('Вы успешно зарегестрировались');
            this.personService.getUserInformation();
            this.router.navigate(['/']);
          },
          // обработка ответа с ошибкой
          error: (errorResponse: HttpErrorResponse) => {
            if(errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка регистрации');
            }
          }
        })
    }
  }

}
