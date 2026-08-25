package com.pennypilot.backend.service;

import com.pennypilot.backend.dto.request.CreateCategoryRequest;
import com.pennypilot.backend.dto.request.UpdateCategoryRequest;
import com.pennypilot.backend.dto.response.CategoryResponse;
import com.pennypilot.backend.entity.Category;
import com.pennypilot.backend.exception.CategoryInUseException;
import com.pennypilot.backend.exception.ResourceNotFoundException;
import com.pennypilot.backend.repository.CategoryRepository;
import com.pennypilot.backend.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ExpenseRepository expenseRepository;

    public CategoryService(CategoryRepository categoryRepository,
                           ExpenseRepository expenseRepository) {
        this.categoryRepository = categoryRepository;
        this.expenseRepository = expenseRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        String name = request.getName().toUpperCase();

        if (categoryRepository.existsByName(name)) {
            throw new IllegalArgumentException(
                    "A category with name '" + name + "' already exists.");
        }

        Category category = new Category();
        category.setName(name);
        category.setLabel(request.getLabel().trim());
        category.setIcon(request.getIcon());
        category.setDefault(false);

        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, UpdateCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + id));

        category.setLabel(request.getLabel().trim());
        category.setIcon(request.getIcon());

        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + id));

        if (category.isDefault()) {
            throw new IllegalArgumentException(
                    "Default categories cannot be deleted.");
        }

        long usageCount = expenseRepository.countByCategoryName(category.getName());
        if (usageCount > 0) {
            throw new CategoryInUseException(
                    "Category '" + category.getLabel() + "' is used by " + usageCount +
                    " expense(s) and cannot be deleted. " +
                    "Please reassign those expenses first.");
        }

        categoryRepository.delete(category);
    }

    // ── Mapper ────────────────────────────────────────────────

    private CategoryResponse toResponse(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setLabel(category.getLabel());
        response.setIcon(category.getIcon());
        response.setDefault(category.isDefault());
        response.setCreatedAt(category.getCreatedAt());
        response.setUpdatedAt(category.getUpdatedAt());
        return response;
    }
}
