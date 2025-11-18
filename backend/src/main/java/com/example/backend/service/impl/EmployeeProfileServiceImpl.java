package com.example.backend.service.impl;

import com.example.backend.domain.EmployeeProfile;
import com.example.backend.domain.User;
import com.example.backend.domain.request.ReqUpdateEmployeeProfile;
import com.example.backend.domain.response.ResEmployeeProfile;
import com.example.backend.domain.response.ResUserDTO;
import com.example.backend.domain.response.ResultPaginationDTO;
import com.example.backend.mapper.EmployeeProfileMapper;
import com.example.backend.repository.EmployeeProfileRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.EmployeeProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeProfileServiceImpl implements EmployeeProfileService {
    private final EmployeeProfileRepository employeeProfileRepository;
    private final EmployeeProfileMapper employeeProfileMapper;
    private final UserRepository userRepository;
    @Override
    public EmployeeProfile handleCreateEmployeeProfile(EmployeeProfile employeeProfile) {
        return this.employeeProfileRepository.save(employeeProfile);
    }

    @Override
    public ResultPaginationDTO handleGetAllEmployeeProfile(Specification<EmployeeProfile> spec, Pageable pageable) {
        Page<EmployeeProfile> pageUser = this.employeeProfileRepository.findAll(spec,pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());

        meta.setPages(pageUser.getTotalPages());
        meta.setTotal(pageUser.getTotalElements());

        rs.setMeta(meta);
        rs.setResult(pageUser.getContent());



        rs.setResult(pageUser.getContent());
        return rs;
    }

    @Override
    public ResEmployeeProfile handleGetEmployeeProfileById(Long id) {
        EmployeeProfile employeeProfile = this.employeeProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found with id:" + id));

        return this.employeeProfileMapper.toResEmployeeProfile(employeeProfile);
    }

    @Override
    public ResEmployeeProfile handleUpdateEmployeeProfile(Long id, ReqUpdateEmployeeProfile req) {
        EmployeeProfile currentEmp = this.employeeProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found with id:" + id));
        User currentUser = currentEmp.getUser();
        if (req.getUser() != null) {
            if (req.getUser().getName() != null) currentUser.setName(req.getUser().getName());
            if (req.getUser().getPhone() != null) currentUser.setPhone(req.getUser().getPhone());
            if (req.getUser().getImage() != null) currentUser.setImage(req.getUser().getImage());
            if (req.getUser().getEmail() != null) currentUser.setEmail(req.getUser().getEmail());

            userRepository.save(currentUser);
        }
        if(req.getEmployeeCode() != null){
            currentEmp.setEmployeeCode(req.getEmployeeCode());
        }
        if(req.getAddress() != null){
            currentEmp.setAddress(req.getAddress());

        }
        if(req.getHireDate() != null){
            currentEmp.setHireDate(req.getHireDate());
        }
        if(req.getSalary() > 0){
            currentEmp.setSalary(req.getSalary());

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
