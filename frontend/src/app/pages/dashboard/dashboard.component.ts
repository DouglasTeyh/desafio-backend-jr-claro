import { Component, OnInit, OnDestroy } from '@angular/core';
import { PedidoService, Pedido } from '../../services/pedido.service';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {

  pedidos: Pedido[] = [];
  pollingSubscription?: Subscription;
  healthStatus: string = 'Carregando...';

  // Cards de resumo
  totalPedidos: number = 0;
  totalProcessamento: number = 0;
  totalPausados: number = 0;

  // Gráfico de Barras
  public barChartOptions: ChartConfiguration['options'] = { responsive: true };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: ['EM_PROCESSAMENTO', 'PAUSADO', 'CANCELADO'],
    datasets: [{ data: [0, 0, 0], label: 'Total de Pedidos' }]
  };

  // Gráfico de Pizza
  public pieChartOptions: ChartConfiguration['options'] = { responsive: true };
  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Pedidos Cadastrados', 'Vagas Restantes'],
    datasets: [{ data: [0, 5] }]
  };

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.carregarDados();
    this.verificarSaudeAPI();

    // Polling a cada 5 segundos (Diferencial)
    this.pollingSubscription = interval(5000).subscribe(() => {
      this.carregarDados();
      this.verificarSaudeAPI();
    });
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  verificarSaudeAPI(): void {
    this.pedidoService.getHealth().subscribe({
      next: (res) => {
        this.healthStatus = res.status;
      },
      error: () => this.healthStatus = 'DOWN'
    });
  }

  carregarDados(): void {
    this.pedidoService.getPedidos().subscribe(data => {
      this.pedidos = data;
      this.atualizarMetricas();
    });
  }

  atualizarMetricas(): void {
    const proc = this.pedidos.filter(p => p.status === 'EM_PROCESSAMENTO').length;
    const pau = this.pedidos.filter(p => p.status === 'PAUSADO').length;
    const can = this.pedidos.filter(p => p.status === 'CANCELADO').length;
    
    // Cards
    this.totalPedidos = this.pedidos.length;
    this.totalProcessamento = proc;
    this.totalPausados = pau;

    // Barras
    this.barChartData = {
      ...this.barChartData,
      datasets: [{ data: [proc, pau, can], label: 'Total de Pedidos' }]
    };

    // Pizza
    const total = this.pedidos.length;
    const restantes = Math.max(5 - total, 0);
    this.pieChartData = {
      ...this.pieChartData,
      datasets: [{ data: [total, restantes] }]
    };
  }
}
