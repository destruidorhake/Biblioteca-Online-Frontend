import { TestBed } from '@angular/core/testing';

import { LivrosAtribuidosService } from './livros-atribuidos.service';

describe('LivrosAtribuidosService', () => {
  let service: LivrosAtribuidosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LivrosAtribuidosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
