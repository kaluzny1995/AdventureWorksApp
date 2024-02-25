import { EAlertType } from "./e-alert-type";

export class AlertMessage {
    static readonly AUTH_REQUIRED = new AlertMessage(EAlertType.WARNING, 'auth_required', 'You must sign in before continuing.');
    static readonly JWT_TOKEN_EXPIRED = new AlertMessage(EAlertType.WARNING, 'jwt_token_expired', 'JWT token expired. Sign in again.');
    static readonly UNKNOWN_AUTH_STATUS = new AlertMessage(EAlertType.WARNING, 'unknown_auth_status', 'Unknown authentication status.');

    static readonly UNKNOWN_STATUS = new AlertMessage(EAlertType.WARNING, 'unknown_status', 'Unknown alert status.');
    static readonly UNKNOWN_ERROR = new AlertMessage(EAlertType.DANGER, 'unknown_error', 'Unknown error occurred.');

    static readonly API_SERVER_DOWN = new AlertMessage(EAlertType.DANGER, 'api_server_down', 'API server down. Please try again later or contact author for support.');
    static readonly API_SERVER_ERROR_400 = new AlertMessage(EAlertType.DANGER, 'api_server_400', 'API server (400) - Bad request. The performed request contains bad information. Please contact author for support.');
    static readonly API_SERVER_ERROR_401 = new AlertMessage(EAlertType.DANGER, 'api_server_401', 'API server (401) - Unauthorized. You are not authorized or must log in again.');
    static readonly API_SERVER_ERROR_404 = new AlertMessage(EAlertType.DANGER, 'api_server_404', 'API server (404) - Not found. The requested object was not found.');
    static readonly API_SERVER_ERROR_422 = new AlertMessage(EAlertType.DANGER, 'api_server_422', 'API server (422) - Unprocessable entity. The object you have provided via request is not valid.');
    static readonly API_SERVER_ERROR_500 = new AlertMessage(EAlertType.DANGER, 'api_server_500', 'API server (500) - Internal error. Please contact author for support.');

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

    static readonly WRONG_OPT_PARAM_NAME = new AlertMessage(EAlertType.DANGER, 'wrong_opt_param_name', 'You have provided wrong optional parameter name.');
    static readonly COLUMN_NOT_FOUND = new AlertMessage(EAlertType.DANGER, 'column_not_found', 'You have provided index of non-existing column.');
    static readonly WRONG_FILTER_NAME = new AlertMessage(EAlertType.DANGER, 'wrong_filter_name', 'You have provided wrong filter name.');
    static readonly WRONG_FILTER_VALUE = new AlertMessage(EAlertType.DANGER, 'wrong_filter_value', 'You have provided wrong filter value.');
    

    constructor(public readonly type: EAlertType, public readonly status: string, public readonly message: string) {}

    public toString(): string {
        return this.status;
    }
}
