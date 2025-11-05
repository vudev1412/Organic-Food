package com.example.backend.domain;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RestResponse<T> {
    private int statusCode;
    private String error;

    private Object message;
    private T data;
}
