import {Component, Input, OnInit} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit {
  @Input() article!: ArticleType;
  serverStaticPath = environment.serverStaticPath;

  constructor() {
    this.article = {
      id: ' ',
      title: ' ',
      description: ' ',
      image: ' ',
      date: ' ',
      category: ' ',
      url: ' '
    }
  }

  ngOnInit(): void {
  }

}
