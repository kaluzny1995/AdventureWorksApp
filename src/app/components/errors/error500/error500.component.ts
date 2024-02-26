import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfigService } from 'src/app/services/utils/app-config.service';

@Component({
  selector: 'app-error500',
  templateUrl: './error500.component.html',
  styleUrls: ['./error500.component.scss']
})
export class Error500Component implements OnInit {
  message: string;
  url: string;
  emailUrl: string;

  constructor(private _config: AppConfigService, private _route: ActivatedRoute) {}

  ngOnInit(): void {
    /* View parameters parsing */
    this._route.params.subscribe((params: Params) => {
      this.message = params['message'];
      this.url = params['url'];
    });

    /* Reading config */
    this.emailUrl = this._config.email;
  }
}
