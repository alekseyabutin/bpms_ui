import {
  Component,
  Input,
  ElementRef,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import * as _ from 'lodash';
import * as backbone from 'backbone';
import * as joint from 'node_modules/jointjs/dist/joint.js';
declare var $: JQueryStatic;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'jointjs-loading',
  // template: '<div #wrapper><div #graph><div id="content1"></div></div></div>',
  template: '<div id="content1"></div>',
  providers: []
})

export class JointJSComponent implements OnInit, AfterViewInit  {

  static readonly defaultLinkAttributes =
    {
      '.connection': { 'stroke-width': '2px' },
      // Arrow on target
      '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' }
    };
  // wrapper is needed for intial sizing, as jointjs replaces the graphElement.
  @ViewChild('wrapper') wrapperElement: ElementRef;
  @ViewChild('graph') graphElement: ElementRef;
  paper: any;
  graph: any;
  timer: any = null;

  path = {
    location: 'file://12345',
    next: [
      {
        location: 's3://media.bucket/12345',
        next: [
          {
            location: 's3://drop.bucket',
            next: []
          },
          {
            location: 'glacier://deep-archive',
            next: []
          }
        ]
      },
      {
        location: 'file://sanA/media',
        next: [
          {
            location: 'diva://catB',
            next: []
          }
        ]
      }
    ]
  };

  ngOnInit() {

    /*this.graph = new joint.dia.Graph();

    this.paper = new joint.dia.Paper({
      el: this.graphElement.nativeElement,
      model: this.graph,
      gridSize: 1,
      'async': true,
      interactive: false,
      defaultConnectionPoint: {
        name: 'boundary',
        args: {
          sticky: true
        }
      }
    } as any);

    this.buildGraph(this.path, null);*/
    const graph = new joint.dia.Graph();
    const paper = new joint.dia.Paper({
      el: $('#content1'),
      // el: this.graphElement.nativeElement,
      width: 1000,
      height: 1000,
      model: graph,
      gridSize: 10,
      drawGrid: true,
      background: {
        color: 'rgb(240,255,255)'
      }
    });
    const rect = new joint.shapes.basic.Rect({
      position: { x: 100, y: 30 },
      size: { width: 100, height: 30 },
      attrs: { rect: { fill: 'blue' }, text: { text: 'my box', fill: 'white' } }
    });
    const rect2 = rect.clone() as joint.shapes.basic.Rect;
    rect2.translate(300);
    const link = new joint.dia.Link({
      source: { id: rect.id },
      target: { id: rect2.id }
    });
    graph.addCells([rect, rect2, link]);
  }

  ngAfterViewInit() {
    console.log(`ngAfterViewInit ${this.wrapperElement.nativeElement.offsetWidth} ${this.wrapperElement.nativeElement.offsetHeight}`);

    this.paper.setDimensions(
      this.wrapperElement.nativeElement.offsetWidth,
      this.wrapperElement.nativeElement.offsetHeight);
    this.doLayout();
  }

  // @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (!this.paper || !this.graph) {
      return;
    }
    this.paper.setDimensions(event.target.innerWidth, event.target.innerHeight);
    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.doLayout();
        this.timer = null;
      }, 500);
    }
  }

  private buildGraph(node: any, previous: any) {
    // create the node
    const current = new joint.shapes.devs.Model({
      size: { width: 200, height: 25 },
      attrs: {
        '.label': {
          text: node.location,
          'font-size': 'medium',
          fill: 'black',
          y: 8
        },
        rect: { fill: 'rbga(0,0,0,0)', stroke: 'rbga(0,0,0,0)' }
      }
    });
    current.addTo(this.graph);

    // link to previous if set
    if (previous) {
      const link = new joint.dia.Link({
        source: current,
        target: previous,
        attrs: JointJSComponent.defaultLinkAttributes,
        markup: '<path class="connection"/><path class="marker-target"/><path class="marker-source"/><g class="labels" />'
        // router: {
        //   name: 'manhattan',
        //   args: {
        //     startDirection: ['right', 'left'],
        //     endDirection:  ['right', 'left']
        //   }
        // }
      });
      link.router('metro', {
        perpendicular: true,
        startDirections: ['left'],
        endDirections: ['right']
      });
      link.addTo(this.graph);
    }

    // proces next / children
    for (const next of node.next) {
      this.buildGraph(next, current);
    }
  }

  private doLayout() {
    // auto layout
    joint.layout.DirectedGraph.layout(this.graph,
      {
        setLinkVertices: false,
        nodeSep: 10,
        edgeSep: 10,
        rankSep: 100,
        marginX: 20,
        marginY: 20,
        rankDir: 'RL'
      });
  }
}
