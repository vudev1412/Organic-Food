package com.example.backend.controller;

import com.example.backend.domain.request.ReqReturnDTO;
import com.example.backend.domain.response.ResReturnDTO;
import com.example.backend.service.ReturnService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/returns")
@RequiredArgsConstructor
public class ReturnController {

    private final ReturnService returnService;

    @GetMapping
    public ResponseEntity<List<ResReturnDTO>> getAll() {
        return ResponseEntity.ok(returnService.getAllReturns());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResReturnDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(returnService.getReturnById(id));
    }

    @PostMapping
    public ResponseEntity<ResReturnDTO> create(@RequestBody ReqReturnDTO dto) {
        return ResponseEntity.ok(returnService.createReturn(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResReturnDTO> update(@PathVariable Long id, @RequestBody ReqReturnDTO dto) {
        return ResponseEntity.ok(returnService.updateReturn(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return ResponseEntity.noContent().build();
    }
}
