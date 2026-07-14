import { Component, OnInit } from '@angular/core';
import { PedidoService, Pedido } from '../../services/pedido.service';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  pedidos: Pedido[] = [];

  // Gráfico de Barras (Pedidos por Status)
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: ['EM_PROCESSAMENTO', 'PAUSADO', 'CANCELADO'],
    datasets: [{ data: [0, 0, 0], label: 'Total de Pedidos' }]
  };

  // Gráfico de Pizza (Total vs Limite)
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Pedidos Cadastrados', 'Vagas Restantes'],
    datasets: [{ data: [0, 5] }]
  };

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.pedidoService.getPedidos().subscribe(data => {
      this.pedidos = data;
      this.atualizarGraficos();
    });
  }

  atualizarGraficos(): void {
    // Barras
    const proc = this.pedidos.filter(p => p.status === 'EM_PROCESSAMENTO').length;
    const pau = this.pedidos.filter(p => p.status === 'PAUSADO').length;
    const can = this.pedidos.filter(p => p.status === 'CANCELADO').length;
    this.barChartData.datasets[0].data = [proc, pau, can];

    // Pizza
    const total = this.pedidos.length;
    const restantes = Math.max(5 - total, 0);
    this.pieChartData.datasets[0].data = [total, restantes];
  }
}
