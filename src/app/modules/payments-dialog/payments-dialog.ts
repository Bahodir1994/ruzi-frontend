import {Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import { CheckoutDto, PaymentMethod, PaymentPartDto } from './payment.model';
import { MessageService } from 'primeng/api';
import { PaymentService } from './payment-service';

import { CommonModule } from '@angular/common';
import {Dialog, DialogModule} from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { Divider } from 'primeng/divider';
import { Tag } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import {ButtonGroup} from 'primeng/buttongroup';

type Row = { method: PaymentMethod; amount: number; externalTxnId?: string | null; loading?: boolean };

@Component({
  selector: 'app-payments-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    DialogModule, InputNumberModule, ButtonModule,
    SelectButtonModule, TooltipModule, CheckboxModule, ToastModule, Divider, Tag,
    InputTextModule, ButtonGroup
  ],
  templateUrl: './payments-dialog.html',
  styleUrl: './payments-dialog.scss'
})
export class PaymentsDialog implements OnChanges{
  @Input() visible = false;
  @Input() cartSessionId!: string;
  @Input() total = 0;
  @Input() hasCustomer = false;
  @Input() defaultRefPercent?: number | null = 2;
  @Output() closed = new EventEmitter<{ success: boolean; result?: any }>();
  @ViewChild('dlg') dlg!: Dialog;
  @Input() hasReferrer = false;

  /** --- Hotkeys (raqamlar + kupyuralar) --- */
  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (!this.visible) return;

    const t = e.target as HTMLElement;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.getAttribute('contenteditable') === 'true')) return;

    if (e.key === 'Escape') { this.visible = false; }
    if (e.key === 'Enter')  { this.confirm(); }

    if (e.key === 'F2')     { this.addRowQuick('CASH'); e.preventDefault(); }
    if (e.key === 'F3')     { this.addRowQuick('CARD'); e.preventDefault(); }
    if (e.key === 'F4')     { this.split50();          e.preventDefault(); }

    if (e.key === 'F5') { this.addCash(50000);   e.preventDefault(); }
    if (e.key === 'F6') { this.addCash(100000);  e.preventDefault(); }
    if (e.key === 'F7') { this.addCash(200000);  e.preventDefault(); }
    if (e.key === 'F8') { this.addCash(10000);   e.preventDefault(); }
    if (e.key === 'F9') { this.addCash(20000);   e.preventDefault(); }
    if ((e.ctrlKey || e.metaKey) && e.key === '0') { this.clearActive(); e.preventDefault(); }

    if (/^[0-9]$/.test(e.key)) { this.appendDigit(e.key); e.preventDefault(); }
    if (e.key === 'Backspace') { this.backspace(); e.preventDefault(); }
  }

  rows: Row[] = [];
  refPercent = 2;
  paid = 0; change = 0; debt = 0;

  /** keypad / active row */
  activeIndex = 0;
  cashPad = [1000, 5000, 10000, 20000, 50000, 100000, 200000];

  get denomRows(): number[][] {
    const out: number[][] = [];
    for (let i = 0; i < this.cashPad.length; i += 3) out.push(this.cashPad.slice(i, i + 3));
    return out;
  }
  methodOptions = [
    { label: 'Naqd', value: 'CASH' as PaymentMethod },
    { label: 'Karta', value: 'CARD' as PaymentMethod },
  ];

  constructor(private api: PaymentService, private ms: MessageService) {}

  ngOnInit() {
    this.refPercent = this.defaultRefPercent ?? 2;
    if (!this.hasReferrer) this.refPercent = 0;   // xamkor yo‘q: bonus 0
    this.rows = [{ method: 'CASH', amount: this.total, externalTxnId: null }];
    this.recalc();
  }

  ngOnChanges(ch: SimpleChanges) {
    if (ch['hasReferrer']) {
      if (!this.hasReferrer) {
        this.refPercent = 0; // xamkor yo‘q – 0%
      } else {
        // xamkor paydo bo‘ldi – agar 0 turgan bo‘lsa defaultga qaytaramiz
        const def = this.defaultRefPercent ?? 2;
        if (this.refPercent === 0 && def > 0) {
          this.refPercent = def;
        }
      }
    }
  }


  handleRefPercentClick() {
    if (!this.hasReferrer) {
      this.ms.add({
        severity: 'warn',
        summary: 'Xamkor yo‘q',
        detail: 'Bonus foizi uchun avval xamkor biriktiring'
      });
    }
  }

  onRefPercentInput() {
    if (!this.hasReferrer) {
      this.refPercent = 0;        // kiritishga urinsa ham 0 da qolsin
      this.handleRefPercentClick();
      return;
    }
    this.recalc();
  }

  /** --- Helpers --- */
  get paymentTypePreview(): 'CASH'|'CARD'|'MIXED' {
    const hasCash = this.rows.some(r => r.method==='CASH' && (r.amount||0) > 0);
    const hasCard = this.rows.some(r => r.method==='CARD' && (r.amount||0) > 0);
    if (hasCash && hasCard) return 'MIXED';
    if (hasCash) return 'CASH';
    return 'CARD';
  }

  setActive(i: number) { this.activeIndex = i; }
  private get activeRow(): Row { return this.rows[this.activeIndex]; }

  addRow() {
    this.rows.push({ method: 'CASH', amount: 0, externalTxnId: null });
    setTimeout(() => this.recalc(), 0);
  }
  addRowQuick(method: PaymentMethod) {
    this.rows.push({ method, amount: 0, externalTxnId: null });
    this.activeIndex = this.rows.length - 1;
    this.fillRemainder(this.activeIndex);
  }
  removeRow(i: number) {
    this.rows.splice(i, 1);
    if (this.activeIndex >= this.rows.length) this.activeIndex = Math.max(0, this.rows.length - 1);
    this.recalc();
  }

  split50() {
    const half = Math.max(this.total/2, 0);
    this.rows = [
      { method: 'CASH', amount: half, externalTxnId: null },
      { method: 'CARD', amount: half, externalTxnId: null },
    ];
    this.activeIndex = 0;
    this.recalc();
  }
  allCash() { this.rows = [{ method: 'CASH', amount: this.total, externalTxnId: null }]; this.activeIndex = 0; this.recalc(); }
  allCard() { this.rows = [{ method: 'CARD', amount: this.total, externalTxnId: null }]; this.activeIndex = 0; this.recalc(); }

  fillRemainder(index: number) {
    const other = this.rows.reduce((s,r,idx)=> idx===index ? s : s + (Number(r.amount)||0), 0);
    const rest = Math.max(this.total - other, 0);
    this.rows[index].amount = rest;
    this.recalc();
  }

  /** keypad */
  addCash(amount: number) {
    const r = this.activeRow; if (!r) return;
    if (r.method !== 'CASH') r.method = 'CASH';
    r.amount = Number(r.amount || 0) + amount;
    if (r.amount < 0) r.amount = 0;
    this.recalc();
  }
  subCash(amount: number) { this.addCash(-amount); }

  appendDigit(d: string) {
    const r = this.activeRow; if (!r) return;
    const cur = Math.max(0, Math.floor(Number(r.amount || 0)));
    const nextStr = (cur === 0 ? '' : String(cur)) + d;
    r.amount = Number(nextStr);
    this.recalc();
  }
  append00() { this.appendDigit('00'); }
  backspace() {
    const r = this.activeRow; if (!r) return;
    const s = String(Math.floor(Number(r.amount || 0)));
    const cut = s.length > 1 ? s.slice(0, -1) : '0';
    r.amount = Number(cut);
    this.recalc();
  }
  clearActive() {
    const r = this.activeRow; if (!r) return;
    r.amount = 0;
    this.recalc();
  }

  recalc() {
    this.paid = this.rows.reduce((s, r) => s + (Number(r.amount)||0), 0);
    this.change = Math.max(this.paid - this.total, 0);
    const recordedPaid = Math.min(this.paid, this.total);
    this.debt = Math.max(this.total - recordedPaid, 0);
  }

  canConfirm() {
    const invalid = this.rows.some(r => r.amount == null || r.amount < 0);
    if (invalid) return false;
    if (this.debt > 0 && !this.hasCustomer) return false;
    return true;
  }

  /** Terminal (stub) */
  requestFromTerminal(i: number) {
    const row = this.rows[i];
    if ((row.amount||0) <= 0) {
      this.ms.add({severity:'warn', summary:'Diqqat', detail:'Avval summa kiriting'});
      return;
    }
    row.loading = true;
    setTimeout(() => {
      row.externalTxnId = 'RRN-' + Date.now();
      row.loading = false;
      this.ms.add({severity:'success', summary:'Terminal', detail:'Chek maʼlumotlari olindi'});
    }, 700);
  }

  confirm() {
    const payments: PaymentPartDto[] = this.rows
      .filter(r => (r.amount || 0) > 0)
      .map(r => ({ method: r.method, amount: Number(r.amount), externalTxnId: r.externalTxnId || null }));

    const body: CheckoutDto = {
      cartSessionId: this.cartSessionId,
      payments,
      referrerBonusPercent: this.refPercent ?? null
    };

    this.api.checkout(body).subscribe({
      next: (res) => {
        this.ms.add({ severity: 'success', summary: 'OK', detail: res.message || 'Chek yopildi' });
        this.visible = false;
        this.closed.emit({ success: true, result: res.data });
      },
      error: (err) => {
        const msg = err?.error?.message || 'Xatolik';
        this.ms.add({ severity: 'error', summary: 'Xato', detail: msg });
      }
    });
  }

  onHide() {
    this.closed.emit({ success: false });
  }

  maximizeOnOpen() {
    setTimeout(() => {
      const root = (this.dlg as any)?.container as HTMLElement | undefined;
      const btn  = root?.querySelector('.p-dialog-header-maximize') as HTMLElement | null;
      // agar hali maximize bo‘lmagan bo‘lsa – tugmani bosamiz
      if (root && !root.classList.contains('p-dialog-maximized')) {
        btn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    });
  }
}
