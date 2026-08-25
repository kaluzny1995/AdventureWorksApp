import { TestBed } from '@angular/core/testing';

import { AlertMessageService } from './alert-message.service';
import { AlertMessage } from '../../models/utils/alert-message';

describe('AlertMessageService', () => {
  let service: AlertMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('statusAlertMesssage', () => {
    it('should return API_SERVER_DOWN for code 0', () => {
      expect(service.statusAlertMesssage(0)).toBe(AlertMessage.API_SERVER_DOWN);
    });

    it('should return API_SERVER_ERROR_400 for code 400', () => {
      expect(service.statusAlertMesssage(400)).toBe(AlertMessage.API_SERVER_ERROR_400);
    });

    it('should return API_SERVER_ERROR_401 for code 401', () => {
      expect(service.statusAlertMesssage(401)).toBe(AlertMessage.API_SERVER_ERROR_401);
    });

    it('should return API_SERVER_ERROR_404 for code 404', () => {
      expect(service.statusAlertMesssage(404)).toBe(AlertMessage.API_SERVER_ERROR_404);
    });

    it('should return API_SERVER_ERROR_422 for code 422', () => {
      expect(service.statusAlertMesssage(422)).toBe(AlertMessage.API_SERVER_ERROR_422);
    });

    it('should return API_SERVER_ERROR_500 for unknown code', () => {
      expect(service.statusAlertMesssage(500)).toBe(AlertMessage.API_SERVER_ERROR_500);
    });

    it('should return API_SERVER_ERROR_500 for code 403', () => {
      expect(service.statusAlertMesssage(403)).toBe(AlertMessage.API_SERVER_ERROR_500);
    });
  });
});
