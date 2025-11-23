package com.example.backend.service;

import com.example.backend.domain.Unit;
import java.util.List;

public interface UnitService {
    Unit handleCreateUnit(Unit unit);
    List<Unit> handleGetAllUnit();
    Unit handleGetUnitById(Long id);
    Unit handleUpdateUnit(Long id, Unit unit);
    void handleDeleteUnit(Long id);
}
