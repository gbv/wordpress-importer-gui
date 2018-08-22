import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Message, MessageService} from "../message.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  @ViewChild('modalTemplate') modalTemplate: TemplateRef<any>;
  constructor(private messageService:MessageService,
              private modalService: BsModalService) {

  }

  modalRef: BsModalRef;
  current:Message;

  ngOnInit() {
    this.messageService.observer().subscribe((message:Message)=>{
      this.current = message;
      this.modalRef = this.modalService.show(this.modalTemplate);

    });
  }

}
