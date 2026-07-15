package com.claro.desafio.api.metrics;

import com.claro.desafio.api.repository.PedidoRepository;
import com.claro.desafio.api.repository.PedidoRepository;
import com.claro.desafio.api.model.StatusPedido;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class PedidoMetrics {

    private final PedidoRepository pedidoRepository;
    private final MeterRegistry meterRegistry;

    public PedidoMetrics(PedidoRepository pedidoRepository, MeterRegistry meterRegistry) {
        this.pedidoRepository = pedidoRepository;
        this.meterRegistry = meterRegistry;
    }

    @PostConstruct
    public void registerMetrics() {
        Gauge.builder("pedidos_total", pedidoRepository, repo -> repo.count())
                .description("Total de pedidos cadastrados")
                .register(meterRegistry);

        for (StatusPedido status : StatusPedido.values()) {
            Gauge.builder("pedidos_por_status", pedidoRepository, repo -> {
                return repo.findAll().stream().filter(p -> p.getStatus() == status).count();
            })
            .tag("status", status.name())
            .description("Pedidos agrupados por status")
            .register(meterRegistry);
        }
    }
}
