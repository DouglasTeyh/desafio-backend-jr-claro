package com.example.demo.controller;

import com.example.demo.model.Pedido;
import com.example.demo.model.StatusPedido;
import com.example.demo.service.PedidoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PedidoController.class)
class PedidoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PedidoService service;

    @Autowired
    private ObjectMapper objectMapper;

    private Pedido pedido;

    @BeforeEach
    void setUp() {
        pedido = new Pedido();
        pedido.setId(1L);
        pedido.setDisplayName("Teste API");
        pedido.setItens(2);
        pedido.setPeso(100L);
        pedido.setStatus(StatusPedido.EM_PROCESSAMENTO);
    }

    @Test
    void listar_Sucesso() throws Exception {
        when(service.listar()).thenReturn(Arrays.asList(pedido));

        mockMvc.perform(get("/api/pedidos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].displayName").value("Teste API"));
    }

    @Test
    void criar_Sucesso() throws Exception {
        when(service.criar(any(Pedido.class))).thenReturn(pedido);

        mockMvc.perform(post("/api/pedidos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(pedido)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void alterarStatus_Sucesso() throws Exception {
        pedido.setStatus(StatusPedido.PAUSADO);
        when(service.alterarStatus(eq(1L), any(StatusPedido.class))).thenReturn(pedido);

        mockMvc.perform(patch("/api/pedidos/1/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\": \"PAUSADO\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PAUSADO"));
    }

    @Test
    void excluir_Sucesso() throws Exception {
        doNothing().when(service).excluir(1L);

        mockMvc.perform(delete("/api/pedidos/1"))
                .andExpect(status().isNoContent());
    }
}
