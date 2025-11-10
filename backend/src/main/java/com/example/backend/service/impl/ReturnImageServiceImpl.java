package com.example.backend.service.impl;

import com.example.backend.domain.Return;
import com.example.backend.domain.ReturnImage;
import com.example.backend.domain.request.ReqReturnImageDTO;
import com.example.backend.domain.response.ResReturnImageDTO;
import com.example.backend.mapper.ReturnImageMapper;
import com.example.backend.repository.ReturnImageRepository;
import com.example.backend.repository.ReturnRepository;
import com.example.backend.service.ReturnImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReturnImageServiceImpl implements ReturnImageService {

    private final ReturnImageRepository returnImageRepository;
    private final ReturnRepository returnRepository;
    private final ReturnImageMapper returnImageMapper;

    @Override
    public List<ResReturnImageDTO> getAllReturnImages() {
        return returnImageRepository.findAll()
                .stream()
                .map(returnImageMapper::toResReturnImageDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ResReturnImageDTO getReturnImageById(Long id) {
        ReturnImage ri = returnImageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ReturnImage not found"));
        return returnImageMapper.toResReturnImageDTO(ri);
    }

    @Override
    public ResReturnImageDTO createReturnImage(ReqReturnImageDTO dto) {
        ReturnImage ri = returnImageMapper.toEntity(dto);
        Return r = returnRepository.findById(dto.getReturnId())
                .orElseThrow(() -> new RuntimeException("Return not found"));
        ri.setReturns(r);
        ReturnImage saved = returnImageRepository.save(ri);
        return returnImageMapper.toResReturnImageDTO(saved);
    }

    @Override
    public ResReturnImageDTO updateReturnImage(Long id, ReqReturnImageDTO dto) {
        ReturnImage ri = returnImageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ReturnImage not found"));

        if(dto.getImageUrl() != null) ri.setImageUrl(dto.getImageUrl());
        if(dto.getUploadedAt() != null) ri.setUploadedAt(dto.getUploadedAt());
        if(dto.getReturnId() > 0) {
            Return r = returnRepository.findById(dto.getReturnId())
                    .orElseThrow(() -> new RuntimeException("Return not found"));
            ri.setReturns(r);
        }

        ReturnImage updated = returnImageRepository.save(ri);
        return returnImageMapper.toResReturnImageDTO(updated);
    }

    @Override
    public void deleteReturnImage(Long id) {
        returnImageRepository.deleteById(id);
    }
}
