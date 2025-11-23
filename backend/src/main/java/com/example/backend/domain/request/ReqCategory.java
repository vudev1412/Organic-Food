
package com.example.backend.domain.request;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqCategory {

        private String name;
        private String slug;
        private Long parentId;

}
