package com.pennypilot.backend.mapper;

import com.pennypilot.backend.dto.request.CreateExpenseRequest;
import com.pennypilot.backend.dto.request.UpdateExpenseRequest;
import com.pennypilot.backend.dto.response.ExpenseResponse;
import com.pennypilot.backend.entity.Expense;
import org.springframework.stereotype.Component;

@Component
public class ExpenseMapper {

    public Expense toEntity(CreateExpenseRequest request) {
        if (request == null) {
            return null;
        }

        Expense expense = new Expense();
        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setDescription(request.getDescription());
        
        return expense;
    }

    public void updateEntityFromRequest(UpdateExpenseRequest request, Expense expense) {
        if (request == null || expense == null) {
            return;
        }

        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setDescription(request.getDescription());
    }

    public ExpenseResponse toResponse(Expense expense) {
        if (expense == null) {
            return null;
        }

        ExpenseResponse response = new ExpenseResponse();
        response.setId(expense.getId());
        response.setTitle(expense.getTitle());
        response.setAmount(expense.getAmount());
        response.setCategory(expense.getCategory());
        response.setExpenseDate(expense.getExpenseDate());
        response.setDescription(expense.getDescription());
        response.setCreatedAt(expense.getCreatedAt());
        response.setUpdatedAt(expense.getUpdatedAt());
        
        return response;
    }
}
