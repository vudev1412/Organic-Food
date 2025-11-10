package com.example.backend.controller;

import com.example.backend.domain.request.ReqReturnItemDTO;
import com.example.backend.domain.response.ResReturnItemDTO;
import com.example.backend.service.ReturnItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/return-items")
@RequiredArgsConstructor
public class ReturnItemController {

    private final ReturnItemService returnItemService;

    @GetMapping
    public ResponseEntity<List<ResReturnItemDTO>> getAll() {
        return ResponseEntity.ok(returnItemService.getAllReturnItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResReturnItemDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(returnItemService.getReturnItemById(id));
    }

    @PostMapping
    public ResponseEntity<ResReturnItemDTO> create(@RequestBody ReqReturnItemDTO dto) {
        return ResponseEntity.ok(returnItemService.createReturnItem(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResReturnItemDTO> update(@PathVariable Long id, @RequestBody ReqReturnItemDTO dto) {
        return ResponseEntity.ok(returnItemService.updateReturnItem(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return ResponseEntity.noContent().build();
    }
}
