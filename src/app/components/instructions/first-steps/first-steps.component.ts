import { Component } from '@angular/core';
import { EFirstStep } from 'src/app/models/instructions/e-first-step';

@Component({
  selector: 'app-first-steps',
  templateUrl: './first-steps.component.html',
  styleUrls: ['./first-steps.component.scss']
})
export class FirstStepsComponent {
  selectedInstruction: string = EFirstStep.SIGNING_UP
  instructionButtons: any[] = [
    {name: "Signing up", value: EFirstStep.SIGNING_UP, icon: "person_add"},
    {name: "Signing in", value: EFirstStep.SIGNING_IN, icon: "person"},
    {name: "Viewing user profile", value: EFirstStep.VIEWING, icon: "info"},
    {name: "Changing user data", value: EFirstStep.CHANGING_DATA, icon: "edit"},
    {name: "Changing credentials", value: EFirstStep.CHANGING_CREDENTIALS, icon: "laptop"},
    {name: "Removing account", value: EFirstStep.REMOVING_ACCOUNT, icon: "delete_forever"},
    {name: "Signing out", value: EFirstStep.SIGNING_OUT, icon: "exit_to_app"}
  ]


  signupSteps: any[] = [
    {name: "1. Username", title: "Unique username.", description: "Username must be provided in order to use it by signing in. The username must be unique."},
    {name: "2. Password & repeating", title: "Password typed twice.", description: "Password must be provided in order to use it by signing in. Then it must be repeated."},
    {name: "3. Full name", title: "Full name for greeting.", description: "Full name must be provided for greeting by application, like \"Hello XYZ\"."},
    {name: "4. E-mail address", title: "Unique e-mail for communication.", description: "E-mail address must be provided to let the application send necessary informations. The e-mail must be unique."},
    {name: "5. (Non)Readonly access", title: "Access only for reading or also for modification/removing.", description: "Check this if the new application user may only view the data. Leave unchecked if this user may also modify or remove certain data."}
  ]
  signinSteps: any[] = [
    {name: "1. Username", title: "Username (login).", description: "Provide username to sign in. Same as during signing up."},
    {name: "2. Password", title: "Password.", description: "Provide password to sign in. Same as during signing up."}
  ]
  viewingSteps: any[] = [
    {name: "1. Your profile", title: "View your profile.", description: "Click on right hand side top menu bar and select \"View profile\"."},
    {name: "2. Personal data", title: "View your data.", description: "The profile view shows your: username, full name, e-mail address, whether your access is readonly and creation/last modification date."},
    {name: "3. Further options", title: "What's next?", description: "Click on \"Change personal data\" to modify your personal data (Full name, e-mail, etc.). Click on \"Change credentials\" to modify your current username or password. Click on \"Remove account\" in order to permanently delete your account."}
  ]
  userDataChangingSteps: any[] = [
    {name: "1. Full name", title: "Changing full name.", description: "You may change your full name visible at application greetings."},
    {name: "2. E-mail", title: "Changing e-mail address.", description: "You may change your contact e-mail address. The e-mail must be unique."},
    {name: "3. (Non)Readonly access", title: "Changing mode of access.", description: "You may change your mode of application access between readonly and nonreadonly and backwards."}
  ]
  userCredentialsChangingSteps: any[] = [
    {name: "0. Changing options", title: "User credentials changing options.", description: "You may change username only, password only or both username and password."},
    {name: "1. New username", title: "Changed username.", description: "You may change your username by providing the new one."},
    {name: "2. Current password", title: "Current password.", description: "You must provide your current password when changing password to new one."},
    {name: "3. New password & repeating", title: "New password typed twice.", description: "You may change your current password providing the new one. You must repeat your new password to proceed."},
    {name: "4. Resigning in", title: "Resigning in required.", description: "Remember when changing username you must resign in with changed one to continue."}
  ]
  accountDeletionSteps: any[] = [
    {name: "1. Removal confirmation", title: "User account removal confirmation (Yes/No).", description: "You may permanently remove your account by clicking \"Yes\" or cancel remove by \"No\"."},
    {name: "2. Password", title: "Mandatory password control.", description: "If account deletion confirmed you must provide your current password and click \"Confirm\". You may still cancel by clicking \"Cancel\"."}
  ]
  signoutSteps: any[] = [
    {name: "1. Toolbar menu", title: "Left top corner personal menu.", description: "To sign out you must click on the left hand side top corner menu."},
    {name: "2. Signout", title: "Bottom signout option.", description: "Then click on \"Sign out\" option at the very bottom of menu dropdown."}
  ]


  instructionPannels: any[] = [
    {value: EFirstStep.SIGNING_UP, images: [
      {name: "signing_up", label: "Empty", half: true},
      {name: "signing_up_filled", label: "Filled in", half: true}
    ], steps: this.signupSteps},
    {value: EFirstStep.SIGNING_IN, images: [
      {name: "signing_in", label: "Empty", half: true},
      {name: "signing_in_filled", label: "Filled in", half: true}
    ], steps: this.signinSteps},
    {value: EFirstStep.VIEWING, image: "viewing", half: false, steps: this.viewingSteps},
    {value: EFirstStep.CHANGING_DATA, image: "changing_user_data_filled", half: true, steps: this.userDataChangingSteps},
    {value: EFirstStep.CHANGING_CREDENTIALS, images: [
      {name: "changing_user_credentials_username_only", label: "Username only", half: true},
      {name: "changing_user_credentials_password_only", label: "Password only", half: true},
      {name: "changing_user_credentials_both", label: "Both", half: true},
      {name: "signing_in_new_credentials", label: "Resigning in", half: true}
    ], steps: this.userCredentialsChangingSteps},
    {value: EFirstStep.REMOVING_ACCOUNT, images: [
      {name: "removing_account_confirmation", label: "Confirmation", half: false},
      {name: "removing_account_password", label: "Password", half: false}
    ], steps: this.accountDeletionSteps},
    {value: EFirstStep.SIGNING_OUT, image: "signing_out", half: true, steps: this.signoutSteps}
  ]

  
  selectInstruction(instruction: string): void {
    this.selectedInstruction = instruction;
  } 
}
