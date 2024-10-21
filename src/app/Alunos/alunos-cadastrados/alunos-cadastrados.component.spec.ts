import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlunosCadastradosComponent } from './alunos-cadastrados.component';

describe('AlunosCadastradosComponent', () => {
  let component: AlunosCadastradosComponent;
  let fixture: ComponentFixture<AlunosCadastradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlunosCadastradosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlunosCadastradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
