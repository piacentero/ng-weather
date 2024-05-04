import { AfterContentInit, Component, ContentChildren, Directive, EventEmitter, Input, Output, QueryList, TemplateRef } from '@angular/core';

@Directive({
  selector: 'app-tab'
})
export class TabDirective {

  @Input({ required: true }) id: string;
  @Input({ required: true }) name: string;
  @Input({ required: true }) templateRef: TemplateRef<any>;
  @Input({ required: true }) content: any;

}

@Component({
  selector: 'app-tabset',
  templateUrl: './tabset.component.html',
  styleUrls: ['./tabset.component.css']
})
export class TabsetComponent implements AfterContentInit {

  @ContentChildren(TabDirective) tabs: QueryList<TabDirective>;

  @Output() tabRemove: EventEmitter<TabDirective> = new EventEmitter();

  activeTab: TabDirective;

  ngAfterContentInit(): void {
    this.activeTab = this.tabs?.first;
  }

  onTabClick(tab: TabDirective): void {
    this.activeTab = tab;
  }

  onTabRemove(tab: TabDirective): void {
    this.tabRemove.emit(tab);

    this.activeTab = this.tabs?.first;
  }

}
