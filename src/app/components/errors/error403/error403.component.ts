import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfigService } from 'src/app/services/utils/app-config.service';

@Component({
  selector: 'app-error403',
  templateUrl: './error403.component.html',
  styleUrls: ['./error403.component.scss']
})
export class Error403Component {
  url: string;
  emailUrl: string;

  constructor(private _config: AppConfigService, private _route: ActivatedRoute) {}

  ngOnInit(): void {
    /* View parameters parsing */
    this._route.params.subscribe((params: Params) => {
      this.url = params['url'];
    });

    /* Reading config */
    this.emailUrl = this._config.email;
  }
}
