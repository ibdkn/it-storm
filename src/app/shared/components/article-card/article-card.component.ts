import {Component, Input, OnInit} from '@angular/core';
import {ArticleService} from "../../services/article.service";
import {ArticleType} from "../../../../types/article.type";
import { environment } from 'src/environments/environment';
import {Router} from "@angular/router";

@Component({
    selector: 'article-card',
    templateUrl: './article-card.component.html',
    styleUrls: ['./article-card.component.scss'],
    standalone: false
})
export class ArticleCardComponent implements OnInit {

  @Input() article!: ArticleType;

  serverStaticPath = environment.serverStaticPath;

  constructor(private articleService: ArticleService,
              private router: Router) {
  }

  ngOnInit() {

  }
}
