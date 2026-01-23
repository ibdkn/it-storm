import {Component, OnInit} from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleType} from "../../../../types/article.type";
import {CategoryService} from "../../../shared/services/category.service";
import {CategoryType} from "../../../../types/category.type";
import {ActivatedRoute, Router} from '@angular/router';
import {ActiveParamsType} from "../../../../types/active-params.type";
import {AppliedFilterType} from 'src/types/applied-filter.type';
import {debounceTime} from "rxjs";
import {ActiveParamsUtil} from 'src/app/shared/utils/active-params.util';
import {LoaderService} from "../../../shared/services/loader.service";

@Component({
    selector: 'app-blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.scss'],
    standalone: false
})
export class BlogComponent implements OnInit {

  articles: ArticleType[] = [];

  categories: CategoryType[] = [];

  appliedFilters: AppliedFilterType[] = [];

  activeParams: ActiveParamsType = {categories: []};

  sortingOpen = false;

  sortingCategoriesChosen = false;

  pages: number[] = [];

  constructor(private articleService: ArticleService,
              private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private loaderService: LoaderService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loaderService.show();
    // Получаем категории для фильтра статей
    this.categoryService.getCategories()
      .subscribe(data => {
        this.categories = data;
      });

    this.activatedRoute.queryParams
      .pipe(
        debounceTime(500)
      )
      .subscribe(params => {
        this.activeParams = ActiveParamsUtil.processParams(params);
        this.loaderService.show();
        this.appliedFilters = [];
        this.activeParams.categories.forEach(url => {

          for(let i = 0; i < this.categories.length; i++) {
            if(this.categories[i].url === url) {
              const foundType = this.categories[i];
              this.appliedFilters.push({
                name: foundType.name,
                urlParam: foundType.url
              });
            }
          }
        });

        // Получаем статьи
        this.articleService.getArticles(this.activeParams)
          .subscribe(data => {
            this.pages = [];
            for (let i = 1; i <= data.pages; i++) {
              this.pages.push(i);
            }

            this.articles = data.items;
            this.loaderService.hide();
          });

      });

  }


  // Открытие/закрытие модалки с фильтрами
  toggleSorting() {
    this.sortingOpen = !this.sortingOpen;
  }

  updateFilterParam(url: string) {
    if(this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingTypeInParams = this.activeParams.categories.find(item => item === url);

      if(existingTypeInParams) {
        this.sortingCategoriesChosen = false;
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== url);
      } else if(!existingTypeInParams) {
        this.sortingCategoriesChosen = true;
        this.activeParams.categories = [...this.activeParams.categories, url];
      }
    } else {
      this.sortingCategoriesChosen = true;
      this.activeParams.categories = [url];
    }

    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    this.activeParams.categories = this.activeParams.categories.filter(item => item !== appliedFilter.urlParam);

    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }


  // Пагинация страниц
  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    }
  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    }
  }

}
