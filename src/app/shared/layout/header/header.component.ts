import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import { HttpErrorResponse } from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {UserInfoType} from "../../../../types/user-info.type";
import {PersonService} from "../../services/person.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class HeaderComponent implements OnInit {

  // Переменная, которая хранит актулаьное состояние (залогинен пользователь или нет)
  isLogged: boolean = false;

  userInfo!: UserInfoType;
  userName: string = '';

  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar,
              private personService: PersonService,
              private router: Router) {
    // Запрашиваем из AuthService первоначальное состояние авторизации пользователя
    this.isLogged = this.authService.getIsLoggedIn();
    this.userName = this.personService.getIsUserInfoName();

  }

  ngOnInit(): void {
    // Подписываемся на сабджект и обновляем состояние при изменении
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });
    this.personService.userInfoName$.subscribe((userName: string) => {
      this.userName = userName;
    })
  }

  // Функция выхода из системы
  logout(): void {
    // Запрос на логаут
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.doLogout();
        }
      })
  }

  doLogout(): void {
    // если логаут прошел успешно, удаляем токены и очищаем ID пользователя
    this.authService.removeTokens();
    this.personService.removeUserInfo();
    this.authService.userId = null;

    // выводим сообщение для пользователя и переводим его на главную страницу
    this._snackBar.open('Вы успешно вышли из системы');
    this.router.navigate(['/']);
  }

}
