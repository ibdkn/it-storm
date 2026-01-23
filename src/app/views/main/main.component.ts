import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {ArticleType} from "../../../types/article.type";
import {ArticleService} from "../../shared/services/article.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";
import {OrderService} from "../../shared/services/order.service";
import {OrderType} from "../../../types/order.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoaderService} from "../../shared/services/loader.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    standalone: false
})
export class MainComponent implements OnInit {

  errorRequest: boolean = false;

  popularArticles: ArticleType[] = [];

  customOptionsMain: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 10,
    dots: true,
    dotsSpeed: 1000,
    navSpeed: 1000,
    autoplay: true,
    autoplaySpeed: 1000,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
    },
    nav: false
  }

  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 26,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
    },
    nav: false
  }

  selectedService: string = '';

  offers = [
    {
      image: 'offer-1.png',
      title: 'Создание сайтов',
      description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: 7500
    },
    {
      image: 'offer-2.png',
      title: 'Продвижение',
      description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: 3500
    },
    {
      image: 'offer-3.png',
      title: 'Реклама',
      description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: 1000
    },
    {
      image: 'offer-4.png',
      title: 'Копирайтинг',
      description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: 750
    },
  ];

  reviews = [
    {
      name: 'Станислав',
      image: 'review1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Алёна',
      image: 'review2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Мария',
      image: 'review3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
    {
      name: 'Аделина',
      image: 'review4.jpg',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Яника',
      image: 'review5.jpg',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Марина',
      image: 'review6.jpg',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
    {
      name: 'Станислав',
      image: 'review7.jpg',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    }
  ];

  @ViewChild('thanksPopup') thanksPopup!: TemplateRef<ElementRef>
  thanksDialogRef: MatDialogRef<any> | null = null;

  @ViewChild('orderPopup') orderPopup!: TemplateRef<ElementRef>
  orderPopupDialogRef: MatDialogRef<any> | null = null;

  order = this.fb.group({
    service: [''],
    name: ['', [Validators.required, Validators.pattern(/^([А-ЯA-z]{1}[а-яa-z]{1,19})+(\s+([А-ЯA-z]{1}[а-яa-z]{1,19})+)?$/)]],
    phone: ['', [Validators.required, Validators.pattern(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/)]],
  });

  constructor(private articleService: ArticleService,
              public dialog: MatDialog,
              private fb: FormBuilder,
              private orderService: OrderService,
              private _snackBar: MatSnackBar,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.loaderService.show();
    this.articleService.getPopularArticles()
      .subscribe((data: ArticleType[]) => {
        this.popularArticles = data;
        this.loaderService.hide();
      });
  }

  openOrderModal(title?: string) {
    // передаю тип услуги и хочу его добавлять в выбранный селект
    if(title) {
      this.order.setValue({
        service: title,
        name: '',
        phone: '',
      })
    }
    this.orderPopupDialogRef = this.dialog.open(this.orderPopup);
  }

  createOrder() {
    if (this.order.valid && this.order.value.service && this.order.value.name && this.order.value.phone) {
      const params: OrderType = {
        name: this.order.value.name,
        phone: this.order.value.phone,
        service: this.order.value.service,
        type: 'order'
      }
      this.orderService.createOrder(params)
        .subscribe({
            next: (data: DefaultResponseType) => {
              this.closeOrderPopup();
              this.thanksDialogRef = this.dialog.open(this.thanksPopup);
            },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this.errorRequest = true;
            }
          }
          }
        );
    }
    if(this.errorRequest) {
      this.order = this.fb.group({
        service: [''],
        name: ['', [Validators.required, Validators.pattern(/^([А-ЯA-z]{1}[а-яa-z]{1,19})+(\s+([А-ЯA-z]{1}[а-яa-z]{1,19})+)?$/)]],
        phone: ['', [Validators.required, Validators.pattern(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/)]],
      });
    }
  }

  closeThanksPopup() {
    this.thanksDialogRef?.close();
  }

  closeOrderPopup() {
    this.orderPopupDialogRef?.close();
    this.order = this.fb.group({
      service: [''],
      name: ['', [Validators.required, Validators.pattern(/^([А-ЯA-z]{1}[а-яa-z]{1,19})+(\s+([А-ЯA-z]{1}[а-яa-z]{1,19})+)?$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/)]],
    });
  }
}
