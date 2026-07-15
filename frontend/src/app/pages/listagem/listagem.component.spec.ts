import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListagemComponent } from './listagem.component';
import { PedidoService } from '../../services/pedido.service';
import { of } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MatTableModule } from '@angular/material/table';

describe('ListagemComponent', () => {
  let component: ListagemComponent;
  let fixture: ComponentFixture<ListagemComponent>;
  let pedidoServiceSpy: jasmine.SpyObj<PedidoService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PedidoService', ['getPedidos', 'updateStatus', 'deletePedido']);
    spy.getPedidos.and.returnValue(of([
      { id: 1, displayName: 'João', itens: 2, peso: 100, status: 'EM_PROCESSAMENTO' }
    ]));

    await TestBed.configureTestingModule({
      imports: [
        ListagemComponent, 
        MatSnackBarModule, 
        BrowserAnimationsModule, 
        RouterTestingModule,
        MatTableModule
      ],
      providers: [
        { provide: PedidoService, useValue: spy }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListagemComponent);
    component = fixture.componentInstance;
    pedidoServiceSpy = TestBed.inject(PedidoService) as jasmine.SpyObj<PedidoService>;
    fixture.detectChanges();
  });

  it('deve carregar pedidos na inicialização', () => {
    expect(pedidoServiceSpy.getPedidos).toHaveBeenCalled();
    expect(component.pedidosData.data.length).toBe(1);
    expect(component.pedidosData.data[0].displayName).toBe('João');
  });

  it('deve verificar limite de 5 pedidos', () => {
    expect(component.podeAdicionar()).toBeTrue();
    component.pedidosData.data = [
      { id: 1, displayName: 'A', itens: 1, peso: 1, status: 'EM_PROCESSAMENTO' },
      { id: 2, displayName: 'B', itens: 1, peso: 1, status: 'EM_PROCESSAMENTO' },
      { id: 3, displayName: 'C', itens: 1, peso: 1, status: 'EM_PROCESSAMENTO' },
      { id: 4, displayName: 'D', itens: 1, peso: 1, status: 'EM_PROCESSAMENTO' },
      { id: 5, displayName: 'E', itens: 1, peso: 1, status: 'EM_PROCESSAMENTO' }
    ];
    expect(component.podeAdicionar()).toBeFalse();
  });

  it('deve permitir ou negar transicoes de status corretas', () => {
    expect(component.podeMudarStatus('EM_PROCESSAMENTO', 'PAUSADO')).toBeTrue();
    expect(component.podeMudarStatus('EM_PROCESSAMENTO', 'EM_PROCESSAMENTO')).toBeFalse();
    expect(component.podeMudarStatus('CANCELADO', 'PAUSADO')).toBeFalse();
  });
});
