import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtribuirLivroAlunoComponent } from './atribuir-livro-aluno.component';

describe('AtribuirLivroAlunoComponent', () => {
  let component: AtribuirLivroAlunoComponent;
  let fixture: ComponentFixture<AtribuirLivroAlunoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtribuirLivroAlunoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AtribuirLivroAlunoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
