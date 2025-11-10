package com.example.backend.controller;

import com.example.backend.domain.request.ReqReturnImageDTO;
import com.example.backend.domain.response.ResReturnImageDTO;
import com.example.backend.service.ReturnImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/return-images")
@RequiredArgsConstructor
public class ReturnImageController {

    private final ReturnImageService returnImageService;

    @GetMapping
    public ResponseEntity<List<ResReturnImageDTO>> getAll() {
        return ResponseEntity.ok(returnImageService.getAllReturnImages());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResReturnImageDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(returnImageService.getReturnImageById(id));
    }

    @PostMapping
    public ResponseEntity<ResReturnImageDTO> create(@RequestBody ReqReturnImageDTO dto) {
        return ResponseEntity.ok(returnImageService.createReturnImage(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResReturnImageDTO> update(@PathVariable Long id, @RequestBody ReqReturnImageDTO dto) {
        return ResponseEntity.ok(returnImageService.updateReturnImage(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return ResponseEntity.noContent().build();
    }
}
