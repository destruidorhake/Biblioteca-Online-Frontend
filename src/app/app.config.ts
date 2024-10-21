import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // Adicionar HTTP_INTERCEPTORS

// Importando os serviços
import { AlunosService } from './services/alunos-service/alunos.service';
import { AuthService } from './Authentication/auth.service';
import { LivrosService } from './services/Livros.Service/livros.service';
import { GeneroService } from './services/Genero.Service/genero.service';
import { UsuariosService } from './services/user-service/usuarios.service';
import { LivrosAtribuidosService } from './services/Livros-Atribuidos-Service/livros-atribuidos.service';
import { PratileiraService } from './services/Pratileiras.Service/pratileira.service';
import { JwtInterceptor } from './Authentication/JwtInterceptor';

// Importando o interceptor JWT

export const appConfig: ApplicationConfig = {
  providers: [
    // Fornecendo serviços necessários
    AuthService,
    AlunosService,
    LivrosService,
    PratileiraService,
    GeneroService,
    UsuariosService,
    LivrosAtribuidosService,

    // Importando módulos
    importProvidersFrom(
      BrowserModule,
      MatTableModule,
      MatButtonModule,
      HttpClientModule, // Adicionando o HttpClientModule aqui
      CommonModule
    ),

    // Adicionando o interceptor JWT
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },

    // Otimizando a detecção de mudanças
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(), // Suporte a animações
    provideClientHydration(), // Hidratação do cliente
    provideRouter(routes), // Configurando as rotas
  ]
};
