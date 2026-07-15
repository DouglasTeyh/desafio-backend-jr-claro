package com.claro.desafio.api.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final com.claro.desafio.api.security.JwtUtil jwtUtil;

    public AuthController(com.claro.desafio.api.security.JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        logger.info("Tentativa de login recebida para o email: {}", email);

        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            logger.warn("Falha no login: credenciais ausentes ou em branco para email: {}", email);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        }

        logger.info("Login realizado com sucesso para o email: {}", email);
        String token = jwtUtil.generateToken(email);
        return Map.of("token", token);
    }
}
