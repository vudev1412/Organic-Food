package com.example.backend.service.impl;

import com.example.backend.domain.EmployeeProfile;
import com.example.backend.domain.response.ResEmployeeProfile;
import com.example.backend.mapper.EmployeeProfileMapper;
import com.example.backend.repository.EmployeeProfileRepository;
import com.example.backend.service.EmployeeProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeProfileServiceImpl implements EmployeeProfileService {
    private final EmployeeProfileRepository employeeProfileRepository;
    private final EmployeeProfileMapper employeeProfileMapper;
    @Override
    public EmployeeProfile handleCreateEmployeeProfile(EmployeeProfile employeeProfile) {
        return this.employeeProfileRepository.save(employeeProfile);
    }

    @Override
    public List<ResEmployeeProfile> handleGetAllEmployeeProfile() {
        return this.employeeProfileRepository.findAll().stream().map(employeeProfileMapper::toResEmployeeProfile).toList();
    }

    @Override
    public ResEmployeeProfile handleGetEmployeeProfileById(Long id) {
        EmployeeProfile employeeProfile = this.employeeProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found with id:" + id));

        return this.employeeProfileMapper.toResEmployeeProfile(employeeProfile);
    }

    @Override
    public ResEmployeeProfile handleUpdateEmployeeProfile(Long id, EmployeeProfile employeeProfile) {
        EmployeeProfile currentEmp = this.employeeProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found with id:" + id));

        if(employeeProfile.getEmployeeCode() != null){
            currentEmp.setEmployeeCode(employeeProfile.getEmployeeCode());
        }
        if(employeeProfile.getAddress() != null){
            currentEmp.setAddress(employeeProfile.getAddress());

        }
        if(employeeProfile.getHireDate() != null){
            currentEmp.setHireDate(employeeProfile.getHireDate());
        }
        if(employeeProfile.getSalary() > 0){
            currentEmp.setSalary(employeeProfile.getSalary());

        }

        this.employeeProfileRepository.save(currentEmp);

        return this.employeeProfileMapper.toResEmployeeProfile(currentEmp);
    }

    @Override
    public ResEmployeeProfile handleFindByUserId(Long id) {
        EmployeeProfile employeeProfile = this.employeeProfileRepository.findByUserId(id);

        return this.employeeProfileMapper.toResEmployeeProfile(employeeProfile);

    }
}
