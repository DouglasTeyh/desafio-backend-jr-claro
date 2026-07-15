package com.example.demo.config;

import com.example.demo.model.Pedido;
import com.example.demo.model.StatusPedido;
import com.example.demo.repository.PedidoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatabaseSeeder {

    @Bean
    CommandLineRunner initDatabase(PedidoRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                Pedido p1 = new Pedido();
                p1.setDisplayName("Pedido #1 - João Silva");
                p1.setItens(2);
                p1.setPeso(1024L);
                p1.setStatus(StatusPedido.EM_PROCESSAMENTO);
                
                Pedido p2 = new Pedido();
                p2.setDisplayName("Pedido #2 - Maria Souza");
                p2.setItens(1);
                p2.setPeso(512L);
                p2.setStatus(StatusPedido.PAUSADO);
                
                Pedido p3 = new Pedido();
                p3.setDisplayName("Pedido #3 - Carlos Lima");
                p3.setItens(4);
                p3.setPeso(2048L);
                p3.setStatus(StatusPedido.CANCELADO);
                
                repository.save(p1);
                repository.save(p2);
                repository.save(p3);
            }
        };
    }
}
