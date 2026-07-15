import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PedidoService, Pedido } from './pedido.service';

describe('PedidoService', () => {
  let service: PedidoService;
  let httpMock: HttpTestingController;

  const mockPedidos: Pedido[] = [
    { id: 1, displayName: 'Teste 1', itens: 2, peso: 100, status: 'EM_PROCESSAMENTO' },
    { id: 2, displayName: 'Teste 2', itens: 1, peso: 50, status: 'PAUSADO' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PedidoService]
    });
    service = TestBed.inject(PedidoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve listar pedidos', () => {
    service.getPedidos().subscribe(pedidos => {
      expect(pedidos.length).toBe(2);
      expect(pedidos).toEqual(mockPedidos);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/pedidos');
    expect(req.request.method).toBe('GET');
    req.flush(mockPedidos);
  });

  it('deve criar um pedido', () => {
    const novoPedido: Pedido = { displayName: 'Novo', itens: 5, peso: 200, status: 'EM_PROCESSAMENTO' };
    const pedidoCriado = { id: 3, ...novoPedido };

    service.createPedido(novoPedido).subscribe(pedido => {
      expect(pedido).toEqual(pedidoCriado);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/pedidos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(novoPedido);
    req.flush(pedidoCriado);
  });

  it('deve alterar o status do pedido', () => {
    const pedidoAtualizado = { ...mockPedidos[0], status: 'CANCELADO' };

    service.updateStatus(1, 'CANCELADO').subscribe(pedido => {
      expect(pedido.status).toBe('CANCELADO');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/pedidos/1/status');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'CANCELADO' });
    req.flush(pedidoAtualizado);
  });

  it('deve deletar um pedido', () => {
    service.deletePedido(1).subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/pedidos/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
