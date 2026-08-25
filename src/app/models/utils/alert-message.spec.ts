import { AlertMessage } from './alert-message';
import { EAlertType } from './e-alert-type';

describe('AlertMessage', () => {
  it('should create an instance', () => {
    expect(new AlertMessage(EAlertType.INFO, 'status', 'Status message.')).toBeTruthy();
  });

  it('should have correct properties', () => {
    const msg = new AlertMessage(EAlertType.WARNING, 'test_status', 'Test message.');
    expect(msg.type).toBe(EAlertType.WARNING);
    expect(msg.status).toBe('test_status');
    expect(msg.message).toBe('Test message.');
  });

  describe('toString', () => {
    it('should return the status string', () => {
      const msg = new AlertMessage(EAlertType.INFO, 'my_status', 'My message.');
      expect(msg.toString()).toBe('my_status');
    });
  });

  describe('Static instances', () => {
    it('should have AUTH_REQUIRED with correct values', () => {
      expect(AlertMessage.AUTH_REQUIRED.type).toBe(EAlertType.WARNING);
      expect(AlertMessage.AUTH_REQUIRED.status).toBe('auth_required');
      expect(AlertMessage.AUTH_REQUIRED.message).toContain('sign in');
    });

    it('should have JWT_TOKEN_EXPIRED with correct values', () => {
      expect(AlertMessage.JWT_TOKEN_EXPIRED.type).toBe(EAlertType.WARNING);
      expect(AlertMessage.JWT_TOKEN_EXPIRED.status).toBe('jwt_token_expired');
    });

    it('should have API_SERVER_DOWN with correct values', () => {
      expect(AlertMessage.API_SERVER_DOWN.type).toBe(EAlertType.DANGER);
      expect(AlertMessage.API_SERVER_DOWN.status).toBe('api_server_down');
    });

    it('should have API_SERVER_ERROR_400 with correct values', () => {
      expect(AlertMessage.API_SERVER_ERROR_400.type).toBe(EAlertType.DANGER);
      expect(AlertMessage.API_SERVER_ERROR_400.status).toBe('api_server_400');
    });

    it('should have API_SERVER_ERROR_401 with correct values', () => {
      expect(AlertMessage.API_SERVER_ERROR_401.type).toBe(EAlertType.DANGER);
      expect(AlertMessage.API_SERVER_ERROR_401.status).toBe('api_server_401');
    });

    it('should have API_SERVER_ERROR_404 with correct values', () => {
      expect(AlertMessage.API_SERVER_ERROR_404.type).toBe(EAlertType.DANGER);
      expect(AlertMessage.API_SERVER_ERROR_404.status).toBe('api_server_404');
    });

    it('should have API_SERVER_ERROR_422 with correct values', () => {
      expect(AlertMessage.API_SERVER_ERROR_422.type).toBe(EAlertType.DANGER);
      expect(AlertMessage.API_SERVER_ERROR_422.status).toBe('api_server_422');
    });

    it('should have API_SERVER_ERROR_500 with correct values', () => {
      expect(AlertMessage.API_SERVER_ERROR_500.type).toBe(EAlertType.DANGER);
      expect(AlertMessage.API_SERVER_ERROR_500.status).toBe('api_server_500');
    });

    it('should have SIGNED_IN with correct values', () => {
      expect(AlertMessage.SIGNED_IN.type).toBe(EAlertType.INFO);
      expect(AlertMessage.SIGNED_IN.status).toBe('signed_in');
    });

    it('should have ALREADY_AUTH with correct values', () => {
      expect(AlertMessage.ALREADY_AUTH.type).toBe(EAlertType.INFO);
      expect(AlertMessage.ALREADY_AUTH.status).toBe('already_auth');
    });

    it('should have SIGNOUT_REQUIRED with correct values', () => {
      expect(AlertMessage.SIGNOUT_REQUIRED.type).toBe(EAlertType.WARNING);
      expect(AlertMessage.SIGNOUT_REQUIRED.status).toBe('signout_required');
    });

    it('should have SIGNUP_SUCCESS with correct values', () => {
      expect(AlertMessage.SIGNUP_SUCCESS.type).toBe(EAlertType.SUCCESS);
      expect(AlertMessage.SIGNUP_SUCCESS.status).toBe('signup_success');
    });

    it('should have USER_DATA_CHANGED with correct values', () => {
      expect(AlertMessage.USER_DATA_CHANGED.type).toBe(EAlertType.INFO);
      expect(AlertMessage.USER_DATA_CHANGED.status).toBe('user_data_changed');
    });

    it('should have USER_CRED_CHANGED with correct values', () => {
      expect(AlertMessage.USER_CRED_CHANGED.type).toBe(EAlertType.INFO);
      expect(AlertMessage.USER_CRED_CHANGED.status).toBe('user_cred_changed');
    });

    it('should have ACCOUNT_REMOVED with correct values', () => {
      expect(AlertMessage.ACCOUNT_REMOVED.type).toBe(EAlertType.INFO);
      expect(AlertMessage.ACCOUNT_REMOVED.status).toBe('account_removed');
    });

    it('should have WRONG_OPT_PARAM_NAME with correct values', () => {
      expect(AlertMessage.WRONG_OPT_PARAM_NAME.type).toBe(EAlertType.DANGER);
      expect(AlertMessage.WRONG_OPT_PARAM_NAME.status).toBe('wrong_opt_param_name');
    });

    it('should have COLUMN_NOT_FOUND with correct values', () => {
      expect(AlertMessage.COLUMN_NOT_FOUND.type).toBe(EAlertType.DANGER);
      expect(AlertMessage.COLUMN_NOT_FOUND.status).toBe('column_not_found');
    });

    it('should have WRONG_FILTER_NAME with correct values', () => {
      expect(AlertMessage.WRONG_FILTER_NAME.type).toBe(EAlertType.DANGER);
      expect(AlertMessage.WRONG_FILTER_NAME.status).toBe('wrong_filter_name');
    });

    it('should have WRONG_FILTER_VALUE with correct values', () => {
      expect(AlertMessage.WRONG_FILTER_VALUE.type).toBe(EAlertType.DANGER);
      expect(AlertMessage.WRONG_FILTER_VALUE.status).toBe('wrong_filter_value');
    });
  });
});
