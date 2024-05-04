import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabDirective, TabsetComponent } from './tabset/tabset.component';

@NgModule({
  declarations: [
    TabsetComponent,
    TabDirective
  ],
  exports: [
    TabDirective,
    TabsetComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
