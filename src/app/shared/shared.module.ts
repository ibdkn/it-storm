import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArticleCardComponent} from "./components/article-card/article-card.component";
import {RouterModule} from "@angular/router";
import {ReduceTheTextPipe} from './pipes/reduce-the-text.pipe';
import {CommentsComponent} from './components/comments/comments.component';
import { CommentBlockComponent } from './components/comment-block/comment-block.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import { LoaderComponent } from './components/loader/loader.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    ArticleCardComponent,
    ReduceTheTextPipe,
    CommentBlockComponent,
    CommentsComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  exports: [
    ArticleCardComponent,
    CommentBlockComponent,
    CommentsComponent,
    LoaderComponent
  ]
})
export class SharedModule {
}
