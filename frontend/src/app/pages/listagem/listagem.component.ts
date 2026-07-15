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
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listagem',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatButtonModule, MatIconModule, MatSnackBarModule,
    RouterModule, MatPaginatorModule, MatSortModule, MatProgressSpinnerModule,
    MatSelectModule, MatFormFieldModule, MatInputModule
  ],
  templateUrl: './listagem.component.html',
  styleUrl: './listagem.component.scss'
})
export class ListagemComponent implements OnInit {
  pedidosData = new MatTableDataSource<Pedido>([]);
  carregando = false;
  displayedColumns: string[] = ['cliente', 'itens', 'peso', 'status', 'acoes'];

  filtroBusca: string = '';
  filtroStatus: string = '';
  statusOpcoes: string[] = ['EM_PROCESSAMENTO', 'PAUSADO', 'CANCELADO'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private pedidoService: PedidoService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.pedidosData.filterPredicate = (pedido: Pedido, filtro: string) => {
      const f = JSON.parse(filtro);
      const nomeOk = !f.nome || pedido.displayName.toLowerCase().includes(f.nome.toLowerCase());
      const statusOk = !f.status || pedido.status === f.status;
      return nomeOk && statusOk;
    };
    this.carregarPedidos();
  }

  aplicarFiltro(): void {
    this.pedidosData.filter = JSON.stringify({
      nome: this.filtroBusca,
      status: this.filtroStatus
    });
  }

  limparFiltros(): void {
    this.filtroBusca = '';
    this.filtroStatus = '';
    this.pedidosData.filter = '';
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
