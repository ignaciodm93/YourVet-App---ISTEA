import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'main-table',
  templateUrl: './main-table.component.html',
  styleUrls: ['./main-table.component.css']
})
export class MainTableComponent implements OnInit, AfterViewChecked {

  @Input()
  public list: any[];

  @Input()
  public colHeaders: string[];

  @Input()
  public rowMaxAmount: number = 10;

  @Input()
  public classPrefix: string;

  @Output()
  public sendAction = new EventEmitter<any>;

  public displayedList: any[];

  private currentRowAmount: number;

  constructor(private changeRef: ChangeDetectorRef) {
  }

  ngAfterViewChecked(): void {
    this.pageChange(1);
    this.changeRef.detectChanges();
  }

  ngOnInit(): void {
    this.displayedList = this.list.slice(0, this.rowMaxAmount);
    this.currentRowAmount = this.displayedList.length;
  }

  public getPropertyArray(item: any): any[] {
    const propertyArray = [];

    for (const key of Object.keys(item)) {
      if (key !== 'actions') {
        propertyArray.push({ key, value: item[key] });
      }
    }

    for (const key of Object.keys(item)) {
      if (key === 'actions') {
        propertyArray.push({ key, value: item[key] });
      };
    }
    return propertyArray;
  }

  public getPropertyActionsArray(property): string[] {
    let arrayToReturn: string[] = [];
    property.value.forEach(element => {
      arrayToReturn.push(element);
    });
    return arrayToReturn;
  }

  public onAction(item: any): void {
    this.sendAction.emit(item);
  }

  public calculatePagesAmount(): number {
    return Math.ceil(this.list.length / this.rowMaxAmount);
  }

  public pageChange(nextPageNumber: number): void {
    let rowArrays = this.dividirListaEnArrays(this.list, this.rowMaxAmount);
    this.displayedList = rowArrays[nextPageNumber - 1];
  }

  private dividirListaEnArrays(lista, cantidad) {
    const subarrays = [];
    for (let i = 0; i < lista.length; i += cantidad) {
      const subarray = lista.slice(i, i + cantidad);
      subarrays.push(subarray);
    }
    return subarrays;
  }
}
