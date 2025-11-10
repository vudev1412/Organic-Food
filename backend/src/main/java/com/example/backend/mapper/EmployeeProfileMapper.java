package com.example.backend.mapper;

import com.example.backend.domain.EmployeeProfile;
import com.example.backend.domain.response.ResEmployeeProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EmployeeProfileMapper {
    @Mapping(source = "user.id",target = "userId")
    ResEmployeeProfile toResEmployeeProfile(EmployeeProfile employeeProfile);

}
