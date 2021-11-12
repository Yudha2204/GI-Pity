/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GIService } from './GI.service';

describe('Service: GI', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GIService]
    });
  });

  it('should ...', inject([GIService], (service: GIService) => {
    expect(service).toBeTruthy();
  }));
});
