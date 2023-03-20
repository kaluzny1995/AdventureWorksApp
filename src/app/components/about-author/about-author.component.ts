import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
  selector: 'app-about-author',
  templateUrl: './about-author.component.html',
  styleUrls: ['./about-author.component.scss']
})
export class AboutAuthorComponent implements OnInit {
  author: any;
  emailUrl: string;

  constructor(private _appConfig: AppConfigService) {}

  ngOnInit(): void {
    this.author = this._appConfig.author;
    this.emailUrl = this._appConfig.emailUrl;
  }
}
