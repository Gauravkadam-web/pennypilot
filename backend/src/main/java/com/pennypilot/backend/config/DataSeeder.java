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
            seed("FOOD",          "Food",          "Utensils"),
            seed("TRANSPORT",     "Transport",     "Bus"),
            seed("SHOPPING",      "Shopping",      "ShoppingBag"),
            seed("BILLS",         "Bills",         "FileText"),
            seed("HEALTH",        "Health",        "HeartPulse"),
            seed("ENTERTAINMENT", "Entertainment", "Film"),
            seed("OTHER",         "Other",         "Tag")
        );

        categoryRepository.saveAll(defaults);
        log.info("Seeded {} default categories.", defaults.size());
    }

    private Category seed(String name, String label, String icon) {
        Category c = new Category();
        c.setName(name);
        c.setLabel(label);
        c.setIcon(icon);
        c.setDefault(true);
        return c;
    }
}
