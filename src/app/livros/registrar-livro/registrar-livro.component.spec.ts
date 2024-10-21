import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarLivroComponent } from './registrar-livro.component';

describe('RegistrarLivroComponent', () => {
  let component: RegistrarLivroComponent;
  let fixture: ComponentFixture<RegistrarLivroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarLivroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrarLivroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
