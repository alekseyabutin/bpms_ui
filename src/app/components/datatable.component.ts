import { Component, Input, ElementRef, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FilmService } from '../film.service';
import { Film } from '../film';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'datatable',
  template: '',
  providers: [FilmService]
})
export class DataTableComponent implements OnDestroy, OnInit {
  // @ts-ignore
  private ui: webix.ui.datatable;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onRowSelect = new EventEmitter<Film>();

  constructor(private films: FilmService, root: ElementRef) {
    // @ts-ignore
    this.ui = webix.ui({
            container: root.nativeElement,
            view: 'datatable', autoConfig: true, data: this.films.getFilms(),
            on: {
              onAfterSelect: (id) => this.onRowSelect.emit(this.ui.getItem(id))
            }
        });
    }

    addRow() {
      this.ui.add({ title: 'New row' });
    }
    updateFilm(film: Film) {
      this.ui.updateItem(film.id, film);
    }
    ngOnInit() {
      this.ui.resize();
    }
    ngOnDestroy() {
      this.ui.destructor();
    }
}
