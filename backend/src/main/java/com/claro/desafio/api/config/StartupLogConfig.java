package com.claro.desafio.api.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class StartupLogConfig {

    private static final Logger logger = LoggerFactory.getLogger(StartupLogConfig.class);

    @EventListener(ApplicationReadyEvent.class)
    public void logApplicationStartup() {
        logger.info("\n----------------------------------------------------------\n\t" +
                "Application 'Desafio Claro' is running!\n\t" +
                "Acesse as interfaces pelo navegador:\n\n\t" +
                "Frontend Angular:\t http://localhost:4200\n\t" +
                "API Swagger UI:\t\t http://localhost:8080/swagger-ui.html\n\t" +
                "Grafana (Métricas):\t http://localhost:3000 (admin/admin)\n\t" +
                "Prometheus:\t\t http://localhost:9090\n" +
                "----------------------------------------------------------");
    }
}
