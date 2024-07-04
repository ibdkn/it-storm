import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ArticleType} from "../../../types/article.type";
import {environment} from "../../../environments/environment";
import {ActiveParamsType} from "../../../types/active-params.type";
import {ArticlesType} from "../../../types/articles.type";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  constructor(private http: HttpClient) { }

  getTopArticles(): Observable<ArticleType[]> {
      return this.http.get<ArticleType[]>(environment.api + 'articles/top')
  }

  getAllArticles(params: ActiveParamsType): Observable<ArticlesType> {
    return this.http.get<ArticlesType>(environment.api + 'articles/', {params: params})
  }
}
