package com.example.backend.service;


import com.example.backend.domain.CustomerProfile;
import com.example.backend.domain.EmployeeProfile;
import com.example.backend.domain.User;
import com.example.backend.domain.request.ReqUpdateEmployeeProfile;
import com.example.backend.domain.response.ResCustomerProfile;
import com.example.backend.domain.response.ResEmployeeProfile;
import com.example.backend.domain.response.ResultPaginationDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface EmployeeProfileService {

    public EmployeeProfile handleCreateEmployeeProfile(EmployeeProfile employeeProfile);
    public ResultPaginationDTO handleGetAllEmployeeProfile(Specification<EmployeeProfile> spec, Pageable pageable);
    public ResEmployeeProfile handleGetEmployeeProfileById(Long id);
    public ResEmployeeProfile handleUpdateEmployeeProfile(Long id, ReqUpdateEmployeeProfile employeeProfile);
    public ResEmployeeProfile handleFindByUserId(Long id);
}
