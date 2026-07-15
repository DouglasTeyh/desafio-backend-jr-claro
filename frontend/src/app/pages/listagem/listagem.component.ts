import { Component, OnInit, ViewChild } from '@angular/core';
import { PedidoService, Pedido } from '../../services/pedido.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listagem',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatSnackBarModule, RouterModule, MatPaginatorModule, MatSortModule, MatProgressSpinnerModule],
  templateUrl: './listagem.component.html',
  styleUrl: './listagem.component.scss'
})
export class ListagemComponent implements OnInit {
  pedidosData = new MatTableDataSource<Pedido>([]);
  carregando = false;
  displayedColumns: string[] = ['cliente', 'itens', 'peso', 'status', 'acoes'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private pedidoService: PedidoService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos(): void {
    this.carregando = true;
    this.pedidoService.getPedidos().subscribe({
      next: (data) => {
        this.pedidosData.data = data;
        this.pedidosData.paginator = this.paginator;
        this.pedidosData.sort = this.sort;
        this.carregando = false;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar pedidos', 'Fechar', { duration: 3000 });
        this.carregando = false;
      }
    });
  }

  podeAdicionar(): boolean {
    return this.pedidosData.data.length < 5;
  }

  podeMudarStatus(atual: string, alvo: string): boolean {
    if (atual === 'EM_PROCESSAMENTO' && (alvo === 'PAUSADO' || alvo === 'CANCELADO')) return true;
    if (atual === 'PAUSADO' && (alvo === 'CANCELADO' || alvo === 'EM_PROCESSAMENTO')) return true;
    if (atual === 'CANCELADO' && alvo === 'EM_PROCESSAMENTO') return true;
    return false;
  }

  alterarStatus(id: number | undefined, status: string): void {
    if (!id) return;
    this.pedidoService.updateStatus(id, status).subscribe({
      next: () => {
        this.snackBar.open(`Status alterado para ${status}`, 'Fechar', { duration: 3000 });
        this.carregarPedidos();
      },
      error: () => {
        this.snackBar.open('Erro ao alterar status', 'Fechar', { duration: 3000 });
      }
    });
  }

  excluir(id: number | undefined): void {
    if (!id) return;
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
      this.pedidoService.deletePedido(id).subscribe({
        next: () => {
          this.snackBar.open('Pedido excluído com sucesso', 'Fechar', { duration: 3000 });
          this.carregarPedidos();
        },
        error: () => {
          this.snackBar.open('Erro ao excluir pedido', 'Fechar', { duration: 3000 });
        }
      });
    }
  }
}
