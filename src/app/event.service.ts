import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  eventsSubject = new Subject<any>();
  listeners = {};

  constructor() {
    this.eventsSubject.subscribe(({ name, args }) => {
      if (this.listeners[name]) {
        for (let listener of this.listeners[name]) {
          listener(...args);
        }
      }
    })
  }

  on(name, listener) {
    if (!this.listeners[name]) {
      this.listeners[name] = [];
    }
    this.listeners[name].push(listener);
  }

  broadcast(name, ...args) {
    this.eventsSubject.next({
      name,
      args
    });
  }
}
