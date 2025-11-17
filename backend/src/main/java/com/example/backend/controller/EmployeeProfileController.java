package com.example.backend.controller;

import com.example.backend.domain.EmployeeProfile;
import com.example.backend.domain.response.ResEmployeeProfile;
import com.example.backend.service.EmployeeProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class EmployeeProfileController {
    private final EmployeeProfileService employeeProfileService;

    @PostMapping("/employee/profile")
    public ResponseEntity<EmployeeProfile> createEmployeeProfile(@RequestBody EmployeeProfile employeeProfile){
        return ResponseEntity.status(HttpStatus.CREATED).body(this.employeeProfileService.handleCreateEmployeeProfile(employeeProfile));
    }

//    @GetMapping("/employee/profile/{id}")
//    public ResponseEntity<ResEmployeeProfile> getEmployeeProfileById(@PathVariable Long id){
//        return ResponseEntity.ok().body(this.employeeProfileService.handleGetEmployeeProfileById(id));
//    }

    @GetMapping("/employee/profile")
    public ResponseEntity<List<ResEmployeeProfile>> getAllEmployeeProfile(){
        return ResponseEntity.ok().body(this.employeeProfileService.handleGetAllEmployeeProfile());
    }
    @PatchMapping("/employee/profile/{id}")
    public ResponseEntity<ResEmployeeProfile> updateEmployeeProfile(@PathVariable Long id,@RequestBody EmployeeProfile employeeProfile){
        return ResponseEntity.ok().body(this.employeeProfileService.handleUpdateEmployeeProfile(id,employeeProfile));
    }
    @GetMapping("/employee/profile/{userId}")
    public ResponseEntity<ResEmployeeProfile> getEmployeeProfileByUserId(@PathVariable Long userId){
        return ResponseEntity.ok().body(this.employeeProfileService.handleFindByUserId(userId));
    }
}
