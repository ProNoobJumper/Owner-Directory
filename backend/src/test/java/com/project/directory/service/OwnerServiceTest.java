package com.project.directory.service;

import com.project.directory.dto.OwnerDTO;
import com.project.directory.exception.ResourceNotFoundException;
import com.project.directory.model.Owner;
import com.project.directory.repository.OwnerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for OwnerService.
 * Uses Mockito to mock dependencies.
 */
@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class OwnerServiceTest {

    @Mock
    private OwnerRepository ownerRepository;

    @Mock
    private SolrService solrService;

    @InjectMocks
    private OwnerService ownerService;

    private Owner testOwner;
    private OwnerDTO.Request testRequest;

    @BeforeEach
    void setUp() {
        testOwner = new Owner();
        testOwner.setId("test-123");
        testOwner.setName("Test Owner");
        testOwner.setCategory("Plumbing");
        testOwner.setCity("Mumbai");
        testOwner.setPhone("9876543210");
        testOwner.setEnabled(true);

        testRequest = new OwnerDTO.Request();
        testRequest.setName("Test Owner");
        testRequest.setCategory("Plumbing");
        testRequest.setCity("Mumbai");
        testRequest.setPhone("9876543210");
    }

    @Test
    @DisplayName("createOwner should save and index owner")
    void createOwner_ShouldSaveAndIndexOwner() {
        // Arrange
        when(ownerRepository.save(any(Owner.class))).thenReturn(testOwner);

        // Act
        Owner result = ownerService.createOwner(testRequest);

        // Assert
        assertNotNull(result);
        assertEquals("Test Owner", result.getName());
        assertEquals("Plumbing", result.getCategory());
        verify(ownerRepository).save(any(Owner.class));
        verify(solrService).indexOwner(any(Owner.class));
    }

    @Test
    @DisplayName("getOwnerById should return owner when exists")
    void getOwnerById_WhenExists_ShouldReturnOwner() {
        // Arrange
        when(ownerRepository.findById("test-123")).thenReturn(Optional.of(testOwner));

        // Act
        Owner result = ownerService.getOwnerById("test-123");

        // Assert
        assertNotNull(result);
        assertEquals("test-123", result.getId());
        assertEquals("Test Owner", result.getName());
    }

    @Test
    @DisplayName("getOwnerById should throw exception when not exists")
    void getOwnerById_WhenNotExists_ShouldThrowException() {
        // Arrange
        when(ownerRepository.findById("invalid")).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> ownerService.getOwnerById("invalid"));
        assertTrue(exception.getMessage().contains("invalid"));
    }

    @Test
    @DisplayName("deleteOwner should soft delete and sync to Solr")
    void deleteOwner_ShouldSoftDeleteAndSync() {
        // Arrange
        when(ownerRepository.findById("test-123")).thenReturn(Optional.of(testOwner));
        when(ownerRepository.save(any(Owner.class))).thenReturn(testOwner);

        // Act
        ownerService.deleteOwner("test-123");

        // Assert
        assertFalse(testOwner.isEnabled()); // Should be disabled (soft deleted)
        verify(ownerRepository).save(testOwner);
        verify(solrService).indexOwner(testOwner);
    }

    @Test
    @DisplayName("updateOwner should update fields and sync to Solr")
    void updateOwner_ShouldUpdateAndSync() {
        // Arrange
        when(ownerRepository.findById("test-123")).thenReturn(Optional.of(testOwner));
        when(ownerRepository.save(any(Owner.class))).thenReturn(testOwner);

        OwnerDTO.Request updateRequest = new OwnerDTO.Request();
        updateRequest.setName("Updated Name");
        updateRequest.setCategory("Electrician");
        updateRequest.setCity("Bangalore");
        updateRequest.setPhone("9988776655");

        // Act
        Owner result = ownerService.updateOwner("test-123", updateRequest);

        // Assert
        assertNotNull(result);
        verify(ownerRepository).save(testOwner);
        verify(solrService).indexOwner(testOwner);
    }
}
