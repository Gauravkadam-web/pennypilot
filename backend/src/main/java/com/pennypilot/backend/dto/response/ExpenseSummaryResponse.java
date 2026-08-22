package com.pennypilot.backend.dto.response;

import java.math.BigDecimal;

public class ExpenseSummaryResponse {
    
    private BigDecimal totalAmount;
    private Long totalCount;

    public ExpenseSummaryResponse() {
    }

    public ExpenseSummaryResponse(BigDecimal totalAmount, Long totalCount) {
        this.totalAmount = totalAmount;
        this.totalCount = totalCount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(Long totalCount) {
        this.totalCount = totalCount;
    }
}
