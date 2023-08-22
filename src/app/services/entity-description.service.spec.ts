import { TestBed } from '@angular/core/testing';

import { EntityDescriptionService } from './entity-description.service';

describe('EntityDescriptionService', () => {
  let service: EntityDescriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityDescriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
