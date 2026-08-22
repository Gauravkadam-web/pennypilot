package com.pennypilot.backend.service;

import com.pennypilot.backend.dto.request.CreateExpenseRequest;
import com.pennypilot.backend.dto.request.UpdateExpenseRequest;
import com.pennypilot.backend.dto.response.ExpenseResponse;
import com.pennypilot.backend.dto.response.ExpenseSummaryResponse;
import com.pennypilot.backend.entity.Expense;
import com.pennypilot.backend.enums.ExpenseCategory;
import com.pennypilot.backend.exception.ResourceNotFoundException;
import com.pennypilot.backend.mapper.ExpenseMapper;
import com.pennypilot.backend.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseMapper expenseMapper;

    public ExpenseService(ExpenseRepository expenseRepository, ExpenseMapper expenseMapper) {
        this.expenseRepository = expenseRepository;
        this.expenseMapper = expenseMapper;
    }

    @Transactional
    public ExpenseResponse createExpense(CreateExpenseRequest request) {
        Expense expense = expenseMapper.toEntity(request);
        Expense savedExpense = expenseRepository.save(expense);
        return expenseMapper.toResponse(savedExpense);
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpenses(ExpenseCategory category, LocalDate startDate, LocalDate endDate) {
        List<Expense> expenses = expenseRepository.findWithFilters(category, startDate, endDate);
        return expenses.stream()
                .map(expenseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ExpenseResponse getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
        return expenseMapper.toResponse(expense);
    }

    @Transactional
    public ExpenseResponse updateExpense(Long id, UpdateExpenseRequest request) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
        
        expenseMapper.updateEntityFromRequest(request, expense);
        Expense updatedExpense = expenseRepository.save(expense);
        return expenseMapper.toResponse(updatedExpense);
    }

    @Transactional
    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Expense not found with id: " + id);
        }
        expenseRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public ExpenseSummaryResponse getExpenseSummary(ExpenseCategory category, LocalDate startDate, LocalDate endDate) {
        BigDecimal totalAmount = expenseRepository.calculateTotalAmountWithFilters(category, startDate, endDate);
        if (totalAmount == null) {
            totalAmount = BigDecimal.ZERO;
        }
        
        Long totalCount = expenseRepository.calculateTotalCountWithFilters(category, startDate, endDate);
        if (totalCount == null) {
            totalCount = 0L;
        }
        
        return new ExpenseSummaryResponse(totalAmount, totalCount);
    }
}
