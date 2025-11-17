package com.example.backend.service;


import com.example.backend.domain.CustomerProfile;
import com.example.backend.domain.EmployeeProfile;
import com.example.backend.domain.response.ResCustomerProfile;
import com.example.backend.domain.response.ResEmployeeProfile;

import java.util.List;

public interface EmployeeProfileService {

    public EmployeeProfile handleCreateEmployeeProfile(EmployeeProfile employeeProfile);
    public List<ResEmployeeProfile> handleGetAllEmployeeProfile();
    public ResEmployeeProfile handleGetEmployeeProfileById(Long id);
    public ResEmployeeProfile handleUpdateEmployeeProfile(Long id, EmployeeProfile employeeProfile);
    public ResEmployeeProfile handleFindByUserId(Long id);
}
