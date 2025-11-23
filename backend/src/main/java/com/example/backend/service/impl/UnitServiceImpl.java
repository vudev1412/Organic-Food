package com.example.backend.service.impl;

import com.example.backend.domain.Unit;
import com.example.backend.repository.UnitRepository;
import com.example.backend.service.UnitService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UnitServiceImpl implements UnitService {

    private final UnitRepository unitRepository;

    @Override
    public Unit handleCreateUnit(Unit unit) {
        return unitRepository.save(unit);
    }

    @Override
    public List<Unit> handleGetAllUnit() {
        return unitRepository.findAll();
    }

    @Override
    public Unit handleGetUnitById(Long id) {
        return unitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Unit not found with id: " + id));
    }

    @Override
    public Unit handleUpdateUnit(Long id, Unit unit) {
        Unit currentUnit = unitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Unit not found with id: " + id));

        if (unit.getName() != null) {
            currentUnit.setName(unit.getName());
        }

        return unitRepository.save(currentUnit);
    }

    @Override
    public void handleDeleteUnit(Long id) {
        unitRepository.deleteById(id);
    }
}
