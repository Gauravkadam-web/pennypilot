package com.pennypilot.backend.repository;

import com.pennypilot.backend.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    @Query("SELECT e FROM Expense e WHERE " +
           "(:category IS NULL OR e.category = :category) AND " +
           "(cast(:startDate as date) IS NULL OR e.expenseDate >= :startDate) AND " +
           "(cast(:endDate as date) IS NULL OR e.expenseDate <= :endDate)")
    List<Expense> findWithFilters(@Param("category") String category,
                                  @Param("startDate") LocalDate startDate,
                                  @Param("endDate") LocalDate endDate);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE " +
           "(:category IS NULL OR e.category = :category) AND " +
           "(cast(:startDate as date) IS NULL OR e.expenseDate >= :startDate) AND " +
           "(cast(:endDate as date) IS NULL OR e.expenseDate <= :endDate)")
    BigDecimal calculateTotalAmountWithFilters(@Param("category") String category,
                                               @Param("startDate") LocalDate startDate,
                                               @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(e) FROM Expense e WHERE " +
           "(:category IS NULL OR e.category = :category) AND " +
           "(cast(:startDate as date) IS NULL OR e.expenseDate >= :startDate) AND " +
           "(cast(:endDate as date) IS NULL OR e.expenseDate <= :endDate)")
    Long calculateTotalCountWithFilters(@Param("category") String category,
                                        @Param("startDate") LocalDate startDate,
                                        @Param("endDate") LocalDate endDate);

    /** Count expenses that use a given category name — used for safe-delete check */
    @Query("SELECT COUNT(e) FROM Expense e WHERE e.category = :categoryName")
    long countByCategoryName(@Param("categoryName") String categoryName);
}
