package com.review.review_web_backend.commandRun;




import com.review.review_web_backend.entities.Role;
import com.review.review_web_backend.repositories.RoleRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepo roleRepository;

    public DataInitializer(RoleRepo roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Check if roles already exist in the database, if not create them
        if (!roleRepository.existsByName(Role.ADMIN)) {
            Role adminRole = new Role();
            adminRole.setName(Role.ADMIN);
            roleRepository.save(adminRole);
        }

        if (!roleRepository.existsByName(Role.EDITOR)) {
            Role editorRole = new Role();
            editorRole.setName(Role.EDITOR);
            roleRepository.save(editorRole);
        }

        if (!roleRepository.existsByName(Role.VIEWER)) {
            Role viewerRole = new Role();
            viewerRole.setName(Role.VIEWER);
            roleRepository.save(viewerRole);
        }

        // You can add more roles here if needed
    }
}


