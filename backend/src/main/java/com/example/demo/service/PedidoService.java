package com.example.demo.service;

import com.example.demo.model.Pedido;
import com.example.demo.model.StatusPedido;
import com.example.demo.repository.PedidoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PedidoService {

    private static final Logger logger = LoggerFactory.getLogger(PedidoService.class);
    private final PedidoRepository repository;

    public PedidoService(PedidoRepository repository) {
        this.repository = repository;
    }

    public List<Pedido> listar() {
        return repository.findAll();
    }

    public Pedido criar(Pedido pedido) {
        if (repository.count() >= 5) {
            logger.warn("Tentativa de criar pedido falhou: limite máximo de 5 pedidos atingido.");
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Limite máximo de 5 pedidos atingido.");
        }
        pedido.setStatus(StatusPedido.EM_PROCESSAMENTO);
        Pedido salvo = repository.save(pedido);
        logger.info("Pedido criado com sucesso: ID {}", salvo.getId());
        return salvo;
    }

    public Pedido alterarStatus(Long id, StatusPedido novoStatus) {
        Pedido pedido = repository.findById(id)
            .orElseThrow(() -> {
                logger.error("Tentativa de alterar status falhou: Pedido {} não encontrado.", id);
                return new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado.");
            });
        
        validarTransicaoStatus(pedido.getStatus(), novoStatus);
        
        StatusPedido statusAnterior = pedido.getStatus();
        pedido.setStatus(novoStatus);
        Pedido salvo = repository.save(pedido);
        logger.info("Status do pedido {} alterado de {} para {}", id, statusAnterior, novoStatus);
        return salvo;
    }

    public void excluir(Long id) {
        if (!repository.existsById(id)) {
            logger.error("Tentativa de excluir falhou: Pedido {} não encontrado.", id);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado.");
        }
        repository.deleteById(id);
        logger.info("Pedido excluído com sucesso: ID {}", id);
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
        logger.warn("Tentativa de transição de status inválida: de {} para {}", de, para);
        throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Transição de status inválida.");
    }
}
