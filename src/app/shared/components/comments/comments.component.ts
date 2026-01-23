import {Component, OnInit, Input} from '@angular/core';
import {CommentType} from "../../../../types/comment.type";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentService} from "../../services/comment.service";
import { FormBuilder } from '@angular/forms';
import {NewCommentType} from "../../../../types/new-comment.type";
import { DefaultResponseType } from 'src/types/default-response.type';
import {MatSnackBar} from "@angular/material/snack-bar";
import { HttpErrorResponse } from '@angular/common/http';
import {CommentActionType} from "../../../../types/comment-action.type";
import {AllCommentType} from "../../../../types/all-comment.type";
import { LoaderService } from '../../services/loader.service';

@Component({
    selector: 'app-comments',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.scss'],
    standalone: false
})
export class CommentsComponent implements OnInit {

  @Input() comments!: CommentType[];
  @Input() articleId!: string;

  commentsActions!: any;
  isLogged: boolean = false;
  allComments!: AllCommentType;
  allCommentsCount!: number;
  offset: number = 3;
  showLoadMoreCommentsButton: boolean = true;

  commentForm = this.fb.group({
    text: [''],
  });

  constructor(private authService: AuthService,
              private commentService: CommentService,
              private fb: FormBuilder,
              private _snackBar: MatSnackBar,
              private loaderService: LoaderService) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });
    this.commentService.getComments(this.articleId, 3)
      .subscribe((actions: DefaultResponseType | AllCommentType) => {
        this.allComments = actions as AllCommentType;
        this.allCommentsCount = this.allComments.allCount;
      });
    this.getArticleCommentsActions(this.articleId);
  }

  addComment() {
    const paramsObject: NewCommentType = {
      text: '',
      article: this.articleId,
    }

    if(this.commentForm.value.text) {
      paramsObject.text = this.commentForm.value.text;
      this.commentService.addComment(paramsObject)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if(data.error) {
              this._snackBar.open(data.message);
              throw new Error(data.message);
            }
            this._snackBar.open('Комментарий успешно добавлен');
            this.getComments(this.articleId);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if(errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка отправки');
            }
          }
        });
      this.commentForm = this.fb.group({
        text: [''],
      });
    }
  }

  getArticleCommentsActions(id: string) {
    this.commentService.getArticleCommentsActions(id)
      .subscribe((actions: DefaultResponseType | CommentActionType[]) => {
        this.commentsActions = actions as CommentActionType[];
      });
  }

  getComments(id: string, offset: number = 0, join: boolean = false) {
    this.loaderService.hide();
    this.commentService.getComments(id, offset)
      .subscribe((comments: DefaultResponseType | AllCommentType) => {
        this.allComments = comments as AllCommentType;
        if(join) {
          this.comments = [...this.comments, ...this.allComments.comments]
        } else {
          this.comments = this.allComments.comments;
        }
        this.allCommentsCount = this.allComments.allCount;
        const offsetLimit = offset + 10 >= this.allCommentsCount;
        this.showLoadMoreCommentsButton = !offsetLimit;
        this.offset = offsetLimit ? offset : offset + 10;
      });
  }

  showMoreComments() {
    this.loaderService.show();
    this.getComments(this.articleId, this.offset, true);
  }

}

