import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActiveParamsType } from 'src/types/active-params.type';
import { ArticlesType } from 'src/types/articles.type';
import {ArticleType} from "../../../types/article.type";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  getPopularArticles(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/top');
  }

  getArticles(params: ActiveParamsType): Observable<ArticlesType> {
    return this.http.get<ArticlesType>(environment.api + 'articles', {
      params: params
    });
  }

  getArticle(url: string): Observable<ArticleType> {
    return this.http.get<ArticleType>(environment.api + 'articles/' + url);
  }

  getRelatedArticles(url: string): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/related/' + url);
  }

}
