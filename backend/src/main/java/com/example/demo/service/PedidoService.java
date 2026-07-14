package com.example.demo.service;

import com.example.demo.model.Pedido;
import com.example.demo.model.StatusPedido;
import com.example.demo.repository.PedidoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PedidoService {

    private final PedidoRepository repository;

    public PedidoService(PedidoRepository repository) {
        this.repository = repository;
    }

    public List<Pedido> listar() {
        return repository.findAll();
    }

    public Pedido criar(Pedido pedido) {
        if (repository.count() >= 5) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Limite máximo de 5 pedidos atingido.");
        }
        pedido.setStatus(StatusPedido.EM_PROCESSAMENTO);
        return repository.save(pedido);
    }

    public Pedido alterarStatus(Long id, StatusPedido novoStatus) {
        Pedido pedido = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado."));
        
        validarTransicaoStatus(pedido.getStatus(), novoStatus);
        
        pedido.setStatus(novoStatus);
        return repository.save(pedido);
    }

    public void excluir(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado.");
        }
        repository.deleteById(id);
    }

    private void validarTransicaoStatus(StatusPedido de, StatusPedido para) {
        if (de == StatusPedido.EM_PROCESSAMENTO && (para == StatusPedido.PAUSADO || para == StatusPedido.CANCELADO)) {
            return;
        }
        if (de == StatusPedido.PAUSADO && (para == StatusPedido.CANCELADO || para == StatusPedido.EM_PROCESSAMENTO)) {
            return;
        }
        if (de == StatusPedido.CANCELADO && para == StatusPedido.EM_PROCESSAMENTO) {
            return;
        }
        throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Transição de status inválida.");
    }
}
