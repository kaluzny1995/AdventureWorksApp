import { Injectable } from '@angular/core';
import { AlertMessage } from '../../models/utils/alert-message';

@Injectable({
  providedIn: 'root'
})
export class AlertMessageService {

  constructor() { }

  statusAlertMesssage(code: number): AlertMessage {
    switch (code) {
      case 0:
        return AlertMessage.API_SERVER_DOWN;
      case 400:
        return AlertMessage.API_SERVER_ERROR_400;
      case 401:
        return AlertMessage.API_SERVER_ERROR_401;
      case 404:
        return AlertMessage.API_SERVER_ERROR_404;
      case 422:
        return AlertMessage.API_SERVER_ERROR_422;
      default:
        return AlertMessage.API_SERVER_ERROR_500;
    }
  }
}
