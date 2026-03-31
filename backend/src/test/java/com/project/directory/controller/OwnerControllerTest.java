package com.project.directory.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.directory.dto.OwnerDTO;
import com.project.directory.model.Owner;
import com.project.directory.service.ImageStorageService;
import com.project.directory.service.OwnerService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.util.List;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OwnerController.class)
@SuppressWarnings("null")
public class OwnerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OwnerService ownerService;

    @MockBean
    private ImageStorageService imageStorageService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void createOwner_ShouldReturnCreatedOwner() throws Exception {
        // Arrange
        OwnerDTO.Request request = new OwnerDTO.Request();
        request.setName("John Doe");
        request.setCategory("Plumbing");
        request.setCity("Mumbai");
        request.setEmail("john@example.com");
        request.setPhone("9876543210");
        request.setDescription("Fixes pipes.");
        request.setEnabled(true);

        Owner owner = new Owner();
        owner.setId("1");
        owner.setName("John Doe");
        owner.setCategory("Plumbing");
        owner.setEnabled(true);

        given(ownerService.createOwner(any(OwnerDTO.Request.class))).willReturn(owner);

        // Act & Assert
        mockMvc.perform(post("/api/owners")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.name").value("John Doe"));
    }

    @Test
    public void searchOwners_ShouldReturnPage() throws Exception {
        // Arrange
        Owner owner = new Owner();
        owner.setId("1");
        owner.setName("John Doe");
        owner.setCategory("Plumbing");
        owner.setEnabled(true);

        Page<Owner> page = new PageImpl<>(List.of(owner));

        given(ownerService.searchOwners(anyString(), anyString(), any(Pageable.class))).willReturn(page);

        // Act & Assert
        mockMvc.perform(get("/api/owners/search")
                .param("query", "John")
                .param("category", "Plumbing")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("John Doe"));
    }

    @Test
    public void createOwner_InvalidInput_ShouldReturnBadRequest() throws Exception {
        // Arrange
        OwnerDTO.Request request = new OwnerDTO.Request();
        // Missing name, email, etc.

        // Act & Assert
        mockMvc.perform(post("/api/owners")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
