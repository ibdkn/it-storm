import {Component, Input, OnChanges} from '@angular/core';
import {CommentType} from "../../../../types/comment.type";
import {CommentService} from "../../services/comment.service";
import {CommentActionType} from "../../../../types/comment-action.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import { HttpErrorResponse } from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'comment-block',
    templateUrl: './comment-block.component.html',
    styleUrls: ['./comment-block.component.scss'],
    standalone: false
})
export class CommentBlockComponent implements OnChanges {
  @Input() comment!: CommentType;
  @Input() commentsActions!: CommentActionType[];
  _commentActions!: CommentActionType[];
  _action!: CommentActionType;
  liked: boolean;
  disliked: boolean;


  constructor(private commentService: CommentService,
              private _snackBar: MatSnackBar) {
    this._action = {
      comment: '',
      action: ''
    };
    this._commentActions = [{
      comment: '',
      action: ''
    }];
    this.liked = false;
    this.disliked = false;
  }

  ngOnChanges(): void {
    if (this.commentsActions !== undefined) {
      this._commentActions = this.commentsActions;
    }
    this.parseCommentActions();
    switch (this._action.action) {
      case 'like': {
        this.liked = true;
        this.disliked = false;
        break;
      }
      case 'dislike': {
        this.disliked = true;
        this.liked = false;
        break;
      }
      default: {
        this.liked = false;
        this.disliked = false;
        break;
      }
    }
  }

  addAction(action: string) {
    const url: string = this.comment.id + '/apply-action';
    const params = {
      action: action
    }

    this.commentService.applyAction(url, params)
      .subscribe({
        next: (data: DefaultResponseType) => {
          if (data.error) {
            this._snackBar.open(data.message);
            throw new Error(data.message);
          }
          if (action === 'like' || action === 'dislike') {
            this._snackBar.open('Ваш голос учтен');
            this.getCommentsAction(this.comment.id);
          } else {
            this._snackBar.open('Жалоба отправлена');
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            if (action === 'like' || action === 'dislike') {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Жалоба уже отправлена');
            }
          } else {
            this._snackBar.open('Ваш голос не был учтен');
          }
        }
      });
  }

  getCommentsAction(id: string) {
    this.commentService.getActionsForComment(id)
      .subscribe((actions) => {
        this._commentActions = actions as CommentActionType[];
        this.parseCommentActions();
        this.adjustCommentAction();
      })
  }

  parseCommentActions() {
    this._commentActions.forEach((commentAction: CommentActionType) => {
      if (commentAction.comment === this.comment.id) {
        this._action = commentAction;
      }
    })
  }

  adjustCommentAction() {
    switch (this._action.action) {
      case 'like': {
        if (this.liked) {
          this.liked = false;
          this.comment.likesCount--;
        } else {
          this.liked = true;
          this.comment.likesCount++;
          this.disliked = false;
          if (this.comment.dislikesCount > 0) {
            this.comment.dislikesCount--;
          }
        }
        break;
      }
      case 'dislike': {
        if (this.disliked) {
          this.disliked = false;
          this.comment.dislikesCount--;
        } else {
          this.disliked = true;
          this.comment.dislikesCount++;
          this.liked = false;
          if (this.comment.likesCount > 0) {
            this.comment.likesCount--;
          }
        }
        break;
      }
      default: {
        this.liked = false;
        this.disliked = false;
      }
    }
  }

}
