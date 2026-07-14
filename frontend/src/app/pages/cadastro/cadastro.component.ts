import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent implements OnInit {
  cadastroForm: FormGroup;
  bloqueado: boolean = false;

  constructor(
    private fb: FormBuilder,
    private pedidoService: PedidoService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.cadastroForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      itens: [1, [Validators.required, Validators.min(1)]],
      peso: [100, [Validators.required, Validators.min(1)]] // em gramas
    });
  }

  ngOnInit(): void {
    this.verificarCapacidade();
  }

  verificarCapacidade(): void {
    this.pedidoService.getPedidos().subscribe(pedidos => {
      if (pedidos.length >= 5) {
        this.bloqueado = true;
        this.cadastroForm.disable();
        this.snackBar.open('Capacidade máxima (5 pedidos) atingida!', 'Fechar', { duration: 5000 });
      }
    });
  }

  onSubmit(): void {
    if (this.cadastroForm.valid && !this.bloqueado) {
      const formValue = this.cadastroForm.value;
      const novoPedido = {
        ...formValue,
        status: 'EM_PROCESSAMENTO'
      };

      this.pedidoService.createPedido(novoPedido).subscribe({
        next: () => {
          this.snackBar.open('Pedido cadastrado com sucesso!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/listagem']);
        },
        error: (err) => {
          this.snackBar.open('Erro ao cadastrar pedido (já existem 5 ou erro na API)', 'Fechar', { duration: 4000 });
        }
      });
    }
  }
}
