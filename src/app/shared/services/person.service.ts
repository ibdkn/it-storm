import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {DefaultResponseType} from "../../../types/default-response.type";
import {Observable, Subject} from 'rxjs';
import { UserInfoType } from 'src/types/user-info.type';
import {environment} from "../../../environments/environment"

@Injectable({
  providedIn: 'root'
})

export class PersonService {

  public userInfo!: UserInfoType;
  public userName: string = 'name';

  // Сабджект для отслеживания нового состояния
  public userInfoName$: Subject<string> = new Subject<string>();
  public userInfoName: string = '';

  constructor(private http: HttpClient) {
    this.userInfoName = localStorage.getItem(this.userName) as string;
  }

  public getIsUserInfoName(): string {
    return this.userInfoName;
  }

  set UserInfo(name: null | string) {
    if(name) {
      localStorage.setItem(this.userName, name);
      this.userInfoName = name;
      this.userInfoName$.next(name);
    }
  }

  get UserInfo(): null | string {
    return localStorage.getItem(this.userName);
  }

  public removeUserInfo(): void {
    localStorage.removeItem(this.userName);
  }

  //Запрос на получение имени пользователя
  getUserInfo(): Observable<UserInfoType | DefaultResponseType> {
    return this.http.get<UserInfoType | DefaultResponseType>(environment.api + 'users');
  }

  public getUserInformation() {
    this.getUserInfo()
      .subscribe((data: UserInfoType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.userInfo = data as UserInfoType;
        this.UserInfo = this.userInfo.name;
        this.userInfoName = this.userInfo.name;
      });
  }

}
