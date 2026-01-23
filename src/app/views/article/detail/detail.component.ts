import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentService} from 'src/app/shared/services/comment.service';
import {CommentType} from "../../../../types/comment.type";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoaderService} from "../../../shared/services/loader.service";

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
    standalone: false
})
export class DetailComponent implements OnInit {

  article!: ArticleType;
  relatedArticles!: ArticleType[];
  serverStaticPath = environment.serverStaticPath;
  articleText: string | undefined = '';
  articleId: string = '';
  comments: CommentType[] = [];
  isLogged: boolean = false;

  commentForm: FormGroup;

  constructor(private authService: AuthService,
              private activatedRoute: ActivatedRoute,
              public articleServices: ArticleService,
              public commentService: CommentService,
              private fb: FormBuilder,
              private _snackBar: MatSnackBar,
              private loaderService: LoaderService) {
    this.isLogged = this.authService.getIsLoggedIn();
    this.commentForm = this.fb.group({
      text: [''],
    });
  }

  ngOnInit(): void {
    this.loaderService.show();

    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    })

    this.activatedRoute.params
      .subscribe(params => {
        this.articleServices.getArticle(params['url'])
          .subscribe((data: ArticleType) => {
            this.article = data;
            this.comments = data.comments as CommentType[];
            this.articleText = data.text;
            this.articleId = data.id;

            this.loaderService.hide();
          });

        this.articleServices.getRelatedArticles(params['url'])
          .subscribe((data: ArticleType[]) => {
            this.relatedArticles = data;
          });
      });
  }
}


