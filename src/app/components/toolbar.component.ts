import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FilmService} from '../film.service';

@Component({
  selector: 'toolbar',
  template: '',
  providers: [FilmService]
})
export class ToolbarComponent implements OnDestroy, OnInit {
  // @ts-ignore
  private ui: webix.ui.toolbar;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onButton = new EventEmitter<string>();

  constructor(private films: FilmService, root: ElementRef) {
    // @ts-ignore
    this.ui = webix.ui({
      container: root.nativeElement,
      view: 'toolbar',
      elements: [
        {view: 'button', value: 'Add Row', width: 150, click: () => this.onButton.emit('add')}
      ]
    });
  }

  ngOnInit() {
    this.ui.resize();
  }

  ngOnDestroy() {
    this.ui.destructor();
  }
}
