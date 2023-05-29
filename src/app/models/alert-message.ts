import { EAlertType } from "./e-alert-type";

export class AlertMessage {
    static readonly AUTH_REQUIRED = new AlertMessage(EAlertType.WARNING, 'auth_required', 'You must sign in before continuing.');
    static readonly JWT_TOKEN_EXPIRED = new AlertMessage(EAlertType.WARNING, 'jwt_token_expired', 'JWT token expired. Sign in again.');
    static readonly UNKNOWN_AUTH_STATUS = new AlertMessage(EAlertType.WARNING, 'unknown_auth_status', 'Unknown authentication status.');

    static readonly UNKNOWN_STATUS = new AlertMessage(EAlertType.WARNING, 'unknown_status', 'Unknown alert status.');
    static readonly UNKNOWN_ERROR = new AlertMessage(EAlertType.DANGER, 'unknown_error', 'Unknown error occurred.');

    static readonly AUTH_ERROR = new AlertMessage(EAlertType.DANGER, 'auth_error', 'Wrong username or password.');
    static readonly SIGNED_IN = new AlertMessage(EAlertType.INFO, 'signed_in', 'Signed in.');
    static readonly ALREADY_AUTH = new AlertMessage(EAlertType.INFO, 'already_auth', 'Already authenticated.');
    static readonly SIGNOUT_REQUIRED = new AlertMessage(EAlertType.WARNING, 'signout_required', 'You must sign out first.');
    static readonly SIGNED_OUT = new AlertMessage(EAlertType.INFO, 'signed_out', 'Signed out.');

    static readonly SIGNUP_SUCCESS = new AlertMessage(EAlertType.SUCCESS, 'signup_success', 'Registration successful. Sign in.');
    static readonly USER_DATA_CHANGED = new AlertMessage(EAlertType.INFO, 'user_data_changed', 'User data changed.');
    static readonly USER_CRED_CHANGED = new AlertMessage(EAlertType.INFO, 'user_cred_changed', 'User credentials changed.');
    static readonly USER_CRED_CH_SIGNOUT = new AlertMessage(EAlertType.INFO, 'user_cred_ch_signout', 'User credentials changed. Sign in with new username');
    static readonly ACCOUNT_REMOVED = new AlertMessage(EAlertType.INFO, 'account_removed', 'Your account has been removed.');
    

    constructor(public readonly type: EAlertType, private readonly status: string, public readonly message: string) {}

    public toString(): string {
        return this.status;
    }
}
