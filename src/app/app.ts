import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { FestivosService } from './services/festivos.service';
import { Festivo } from './shared/entidades/festivo';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxDatatableModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [DatePipe]
})
export class AppComponent implements OnInit {
  title = 'festivoscf-app';
  anioConsulta: number = new Date().getFullYear();
  festivosAnio: Festivo[] = [];
  columnasLista = [
    { prop: 'festivo', name: 'Festivo' },
    { prop: 'fecha', name: 'Fecha' }
  ];
  fechaConsulta: Date | string | null = null;
  resultadoVerificacion: string = '';
  mostrarResultadoVerificacion: boolean = false;

  constructor(
    private festivosService: FestivosService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.consultarFestivosPorAnio();
  }

  consultarFestivosPorAnio(): void {
    if (this.anioConsulta) {
      this.festivosService.getFestivosPorAnio(this.anioConsulta).subscribe({
        next: (data: Festivo[]) => {
          this.festivosAnio = data;
        },
        error: () => {
          this.festivosAnio = [];
          alert('Error al cargar los festivos del año.');
        }
      });
    } else {
      this.festivosAnio = [];
    }
  }

  verificarFecha(): void {
    this.mostrarResultadoVerificacion = false;

    let fechaConvertida: Date;

    try {
      fechaConvertida = new Date(this.fechaConsulta as any);
    } catch {
      this.resultadoVerificacion = 'Fecha inválida. Intenta nuevamente.';
      this.mostrarResultadoVerificacion = true;
      return;
    }

    if (!fechaConvertida || isNaN(fechaConvertida.getTime())) {
      this.resultadoVerificacion = 'Selecciona una fecha válida antes de verificar.';
      this.mostrarResultadoVerificacion = true;
      return;
    }

    const anio = fechaConvertida.getUTCFullYear();
    const mes = fechaConvertida.getUTCMonth() + 1;
    const dia = fechaConvertida.getUTCDate();

    this.festivosService.verificarFestivo(anio, mes, dia).subscribe({
      next: (data: string) => {
        const respuesta = data.trim().toLowerCase();
        this.resultadoVerificacion =
          respuesta === 'true' || respuesta.includes('sí') || respuesta.includes('festivo')
            ? ` ¡Sí! , la fecha es festivo`
            : 'La fecha seleccionada NO es festiva.';
        this.mostrarResultadoVerificacion = true;
      },
      error: () => {
        this.resultadoVerificacion = 'Error al verificar la fecha.';
        this.mostrarResultadoVerificacion = true;
      }
    });
  }
}