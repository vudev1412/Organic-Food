package com.example.backend.controller;

import com.example.backend.domain.Return;
import com.example.backend.domain.User;
import com.example.backend.domain.request.ReqReturnDTO;
import com.example.backend.domain.response.ResReturnDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.service.ReturnService;
import com.turkraft.springfilter.boot.Filter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/returns")
@RequiredArgsConstructor
public class ReturnController {

    private final ReturnService returnService;

    @GetMapping
    public ResponseEntity<ResultPaginationDTO> getAllReturns(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Pageable pageable = PageRequest.of(page - 1, size);
        ResultPaginationDTO result = returnService.getAllReturns(keyword, pageable);
        return ResponseEntity.ok(result);
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
        this.returnService.deleteReturn(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/check/{orderId}")
    public ResponseEntity<?> checkReturn(@PathVariable Long orderId) {

        Map<String, Object> data = returnService.checkReturnRequest(orderId);

        return ResponseEntity.ok(
                new HashMap() {{
                    put("statusCode", 200);
                    put("error", null);
                    put("message", "CHECK RETURN SUCCESS");
                    put("data", data);
                }}
        );
    }
}
