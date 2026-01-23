import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {NewCommentType} from "../../../types/new-comment.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {map, Observable} from "rxjs";
import {ReactionType} from "../../../types/reaction-type";
import { CommentActionType } from 'src/types/comment-action.type';
import {CommentType} from "../../../types/comment.type";
import {AllCommentType} from "../../../types/all-comment.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) {}

  getCommentsMapper(response: any) {
    return response.comments;
  }

  getComments(id: string, offset: number): Observable<DefaultResponseType | AllCommentType> {
    return this.http
      .get<DefaultResponseType | AllCommentType>(environment.api + 'comments?offset=' + offset + '&article=' + id)
  }

  addComment(params: NewCommentType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', params);
  }

  applyAction(url: string, params: ReactionType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + url, params);
  }

  getActionsForComment(id: string): Observable<DefaultResponseType | CommentActionType[]> {
    return this.http.get<DefaultResponseType | CommentActionType[]>(environment.api + 'comments/' + id + '/actions');
  }

  getArticleCommentsActions(id: string): Observable<DefaultResponseType | CommentActionType[]> {
    return this.http.get<DefaultResponseType | CommentActionType[]>(environment.api + 'comments/article-comment-actions?articleId=' + id);
  }

}
