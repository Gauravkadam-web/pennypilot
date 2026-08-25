package com.pennypilot.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UpdateCategoryRequest {

    @NotBlank(message = "Label is required")
    @Size(max = 60, message = "Label must not exceed 60 characters")
    private String label;

    @NotBlank(message = "Icon is required")
    private String icon;

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
