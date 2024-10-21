import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivrosAtibuidosAlunoComponent } from './livros-atibuidos-aluno.component';

describe('LivrosAtibuidosAlunoComponent', () => {
  let component: LivrosAtibuidosAlunoComponent;
  let fixture: ComponentFixture<LivrosAtibuidosAlunoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivrosAtibuidosAlunoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LivrosAtibuidosAlunoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
