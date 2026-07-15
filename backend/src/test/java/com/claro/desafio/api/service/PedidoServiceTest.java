package com.claro.desafio.api.service;

import com.claro.desafio.api.model.Pedido;
import com.claro.desafio.api.model.StatusPedido;
import com.claro.desafio.api.repository.PedidoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PedidoServiceTest {

    @Mock
    private PedidoRepository repository;

    @InjectMocks
    private PedidoService service;

    private Pedido pedido;

    @BeforeEach
    void setUp() {
        pedido = new Pedido();
        pedido.setId(1L);
        pedido.setDisplayName("Teste");
        pedido.setItens(2);
        pedido.setPeso(100L);
        pedido.setStatus(StatusPedido.EM_PROCESSAMENTO);
    }

    @Test
    void criar_Sucesso() {
        when(repository.count()).thenReturn(4L);
        when(repository.save(any(Pedido.class))).thenReturn(pedido);

        Pedido salvo = service.criar(new Pedido());

        assertNotNull(salvo);
        assertEquals(StatusPedido.EM_PROCESSAMENTO, salvo.getStatus());
        verify(repository).save(any(Pedido.class));
    }

    @Test
    void criar_FalhaLimiteMaximo() {
        when(repository.count()).thenReturn(5L);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> service.criar(new Pedido()));

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex.getStatusCode());
        verify(repository, never()).save(any());
    }

    @Test
    void alterarStatus_Sucesso() {
        when(repository.findById(1L)).thenReturn(Optional.of(pedido));
        when(repository.save(any(Pedido.class))).thenReturn(pedido);

        Pedido atualizado = service.alterarStatus(1L, StatusPedido.PAUSADO);

        assertEquals(StatusPedido.PAUSADO, atualizado.getStatus());
    }

    @Test
    void alterarStatus_FalhaTransicaoInvalida() {
        pedido.setStatus(StatusPedido.PAUSADO);
        when(repository.findById(1L)).thenReturn(Optional.of(pedido));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, 
            () -> service.alterarStatus(1L, StatusPedido.PAUSADO));

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex.getStatusCode());
    }
}
