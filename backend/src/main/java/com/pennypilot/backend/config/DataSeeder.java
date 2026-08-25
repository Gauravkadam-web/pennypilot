package com.pennypilot.backend.config;

import com.pennypilot.backend.entity.Category;
import com.pennypilot.backend.repository.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeds the 7 default categories on first startup if the table is empty.
 * These defaults match the original ExpenseCategory enum values, so existing
 * expense records (e.g. category = "FOOD") remain fully valid.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final CategoryRepository categoryRepository;

    public DataSeeder(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            log.info("Categories already seeded — skipping.");
            return;
        }

        List<Category> defaults = List.of(
            seed("FOOD",          "Food",          "#F59E0B"),
            seed("TRANSPORT",     "Transport",     "#3B82F6"),
            seed("SHOPPING",      "Shopping",      "#EC4899"),
            seed("BILLS",         "Bills",         "#8B5CF6"),
            seed("HEALTH",        "Health",        "#10B981"),
            seed("ENTERTAINMENT", "Entertainment", "#F43F5E"),
            seed("OTHER",         "Other",         "#6B7280")
        );

        categoryRepository.saveAll(defaults);
        log.info("Seeded {} default categories.", defaults.size());
    }

    private Category seed(String name, String label, String color) {
        Category c = new Category();
        c.setName(name);
        c.setLabel(label);
        c.setColor(color);
        c.setDefault(true);
        return c;
    }
}
