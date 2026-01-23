import {Component, ElementRef, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";
import {OrderService} from "../../services/order.service";
import {OrderType} from "../../../../types/order.type";
import {DefaultResponseType} from "../../../../types/default-response.type";

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: false
})
export class FooterComponent {

  @ViewChild('thanksPopup') thanksPopup!: TemplateRef<ElementRef>
  thanksDialogRef: MatDialogRef<any> | null = null;

  @ViewChild('freeConsultationPopup') freeConsultationPopup!: TemplateRef<ElementRef>
  freeConsultationPopupDialogRef: MatDialogRef<any> | null = null;

  freeConsultationOrder = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^([А-ЯA-z]{1}[а-яa-z]{1,19})+(\s+([А-ЯA-z]{1}[а-яa-z]{1,19})+)?$/)]],
    phone: ['', [Validators.required, Validators.pattern(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/)]],
  });

  constructor(public dialog: MatDialog,
              private fb: FormBuilder,
              private orderService: OrderService) {
  }

  orderConsultation() {
    if (this.freeConsultationOrder.valid && this.freeConsultationOrder.value.name && this.freeConsultationOrder.value.phone) {
      const params: OrderType = {
        name: this.freeConsultationOrder.value.name,
        phone: this.freeConsultationOrder.value.phone,
        service: 'Консультация',
        type: 'consultation'
      }
      this.orderService.createOrder(params)
        .subscribe({
            next: (data: DefaultResponseType) => {
              this.closeFreeConsultationPopup();
              this.thanksDialogRef = this.dialog.open(this.thanksPopup);
            }
          }
        )
    }
    this.freeConsultationOrder = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^([А-ЯA-z]{1}[а-яa-z]{1,19})+(\s+([А-ЯA-z]{1}[а-яa-z]{1,19})+)?$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/)]],
    });
  }

  closeThanksPopup() {
    this.thanksDialogRef?.close();
  }

  openFreeConsultationPopup() {
    this.freeConsultationPopupDialogRef = this.dialog.open(this.freeConsultationPopup);
  }

  closeFreeConsultationPopup() {
    this.freeConsultationPopupDialogRef?.close();
    this.freeConsultationOrder = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^([А-ЯA-z]{1}[а-яa-z]{1,19})+(\s+([А-ЯA-z]{1}[а-яa-z]{1,19})+)?$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/)]],
    });
  }

}
