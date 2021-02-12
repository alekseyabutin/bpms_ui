import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  forwardRef,
  Input,
  OnInit,
  QueryList
} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'columns',
  template: '<ng-content></ng-content>'
})
export class ColumnsComponent implements OnInit, AfterContentInit {
  // @ts-ignore
  private ui: webix.ui.layout;
  private root: ElementRef;

  @Input() type: string;
  @Input() padding: number;
  @Input() margin: number;

  @ContentChildren(forwardRef(() => CellComponent)) cells: QueryList<CellComponent>;

  constructor(root: ElementRef) {
    this.root = root;
  }

  getBaseConfig(): any {
    return {
      view: 'layout',
      cols: []
    };
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit(): void {
    const config: any = this.getBaseConfig();
    config.container = this.root.nativeElement;

    if (this.padding) {
      config.padding = this.padding * 1;
    }
    if (this.margin) {
      config.margin = this.margin * 1;
    }
    if (this.type) {
      config.type = this.type;
    }

    // @ts-ignore
    this.ui = (webix.ui(config) as webix.ui.layout);
  }


  ngAfterContentInit() {
    this.cells.forEach((item) => this.ui.addView(item.getView()));
    this.ui.resize();
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'rows',
  template: '<ng-content></ng-content>'
})
export class RowsComponent extends ColumnsComponent {
  constructor(root: ElementRef) {
    super(root);
  }

  getBaseConfig(): any {
    return {
      view: 'layout',
      rows: []
    };
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cell',
  template: '<ng-content></ng-content>'
})
export class CellComponent {
  private root: ElementRef;
  @Input() content: string;
  @Input() height: number;
  @Input() width: number;
  @Input() minHeight: number;
  @Input() minWidth: number;
  @Input() maxHeight: number;
  @Input() maxWidth: number;
  @Input() gravity: number;

  constructor(root: ElementRef) {
    this.root = root;
  }

  getView(): any {
    const view = this.root.nativeElement.querySelector('[view_id]');
    // tslint:disable-next-line:one-variable-per-declaration
    let result, config;
    if (!view) {
      result = config = {view: 'template', content: this.content || this.root.nativeElement};
    }
    else {
      // @ts-ignore
      result = webix.$$(view.getAttribute('view_id'));
      config = result.config;
    }

    if (this.width) {
      config.width = this.width * 1;
    }
    if (this.height) {
      config.height = this.height * 1;
    }
    if (this.minHeight) {
      config.minHeight = this.minHeight * 1;
    }
    if (this.minWidth) {
      config.minWidth = this.minWidth * 1;
    }
    if (this.maxHeight) {
      config.maxHeight = this.maxHeight * 1;
    }
    if (this.maxWidth) {
      config.maxWidth = this.maxWidth * 1;
    }
    if (this.gravity) {
      config.gravity = this.gravity * 1;
    }

    return result;
  }
}
