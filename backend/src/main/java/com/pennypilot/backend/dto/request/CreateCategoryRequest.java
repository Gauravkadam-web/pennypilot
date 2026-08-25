package com.pennypilot.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CreateCategoryRequest {

    @NotBlank(message = "Category name is required")
    @Size(max = 50, message = "Name must not exceed 50 characters")
    @Pattern(regexp = "^[A-Z0-9_]+$", message = "Name must be uppercase letters, digits, or underscores only")
    private String name;

    @NotBlank(message = "Label is required")
    @Size(max = 60, message = "Label must not exceed 60 characters")
    private String label;

    @NotBlank(message = "Icon is required")
    private String icon;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
