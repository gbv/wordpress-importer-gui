import {Injectable} from '@angular/core';
import {Subject} from "rxjs/internal/Subject";
import {Observable} from "rxjs/internal/Observable";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private messages = new Subject<Message>();

  constructor() {
  }

  public push(msg: Message) {
    this.messages.next(msg);
  }

  public observer(): Observable<Message> {
    return this.messages.asObservable();
  }

}

export interface Message {
  title: string;
  message: string;
  color: Color;
}

export enum Color {
  success = "success", info = "info", warning = "warning", danger = "danger", primary = "primary", secondary = "secondary", dark = "dark"
}
