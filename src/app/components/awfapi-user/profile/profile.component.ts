import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { AlertMessage } from 'src/app/models/alert-message';
import { ViewedUser } from 'src/app/models/awfapi-user/viewed-user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AwfapiUserService } from 'src/app/services/awfapi-user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  mainAlert: AlertMessage | null = null;
  mainAlertDismiss() {
    this.mainAlert = null;
  }

  viewedUser: ViewedUser;

  profileDeletionWarning: string = 'This action cannot be undone!';

  constructor(private _userService: AwfapiUserService, private _auth: AuthenticationService, private _route: ActivatedRoute) { }

  ngOnInit(): void {
    if (this._route.snapshot.paramMap.has('status')) {
      let status = this._route.snapshot.paramMap.get('status');
      switch (status) {
        case 'signed_in': {
          this.mainAlert = AlertMessage.SIGNED_IN;
          break;
        }
        default: {
          this.mainAlert = AlertMessage.UNKNOWN_STATUS;
          break;
        }
      }
    }

    this._auth.getCurrentUser().subscribe({
      next: (result: any) => {
        this._userService.view(result.username).pipe(map(data => ({
          username: data.username,
          fullName: data.full_name,
          email: data.email,
          isReadonly: Boolean(data.is_readonly),
          dateCreated: new Date(data.date_created),
          dateModified: new Date(data.date_modified)
        }) as ViewedUser)).subscribe({
          next: (result: ViewedUser) => {
            console.log('User data loaded for profile view.', result);
            this.viewedUser = result;
          },
          error: (error) => {
            console.error('Error while loading user data for profile view.', error);
          }
        });
      },
      error: (error) => {
        console.error('Failed to retrieve username.', error);
      }
    });

    
  }
}
