import { Injectable } from '@angular/core';
import {Observable, Subject, throwError} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Строковые константы для токенов и ID пользователя
  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public userIdKey: string = 'userId';

  // Сабджект для отслеживания нового состояния
  public isLogged$: Subject<boolean> = new Subject<boolean>();

  // Приватная переменная, которая хранит состояние в моменте
  private isLogged: boolean = false;

  constructor(private http: HttpClient) {
    // При открытии сайта проверяем залогинен ли пользователь
    // Устанавливаем актуальное значение в переменную isLogged
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }

  // Запрос на логин
  login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', {
      email, password, rememberMe
    })
  }

  // Запрос на логаут
  logout(): Observable<DefaultResponseType> {
    // получаем токены и помещаем их в переменную tokens
    const tokens = this.getTokens();

    // если токены есть и есть рефреш токен, то делаем запрос на логаут и передаем туда рефреш токен
    if(tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {
        refreshToken: tokens.refreshToken
      })
    }
    // если токенов нет, выбрасываем ошибку
    throw throwError(() => 'Токены не найдены');
  }

  // Запрос на регистрацию
  signup(name: string, email: string, password: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup', {
      name, email, password
    })
  }

  public getIsLoggedIn() {
    return this.isLogged;
  }

  // Устанавливаем токены
  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);

    // Меняем актуальное значение
    this.isLogged = true;

    // Оповещаем слушателей сабджекта об изменениях
    this.isLogged$.next(true);
  }

  // Удаляем токены
  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);

    // Меняем актуальное значение
    this.isLogged = false;

    // Оповещаем слушателей сабджекта об изменениях
    this.isLogged$.next(false);
  }

  // Получаем токены
  public getTokens(): {accessToken: string | null, refreshToken: string | null} {
    // Возвращаем объект с соответсвующими полями
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey),
    }
  }

  // Получаем ID пользователя
  get userId(): null | string {
    return  localStorage.getItem(this.userIdKey);
  }

  // Устанавливаем ID пользователя
  set userId(id: null | string) {
    if(id) {
      localStorage.setItem(this.userIdKey, id);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }

  refresh(): Observable<DefaultResponseType | LoginResponseType> {
    const tokens = this.getTokens();
    if(tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'refresh', {
        refreshToken: tokens.refreshToken
      })
    }
    throw throwError(() => 'Can not use token');
  }

}
