package com.lab1.lab1.config;

import org.eclipse.persistence.jpa.PersistenceProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.*;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import jakarta.persistence.EntityManagerFactory;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackages = "com.lab1.lab1",
        entityManagerFactoryRef = "entityManagerFactory",
        transactionManagerRef = "transactionManager"
)
public class EclipseLinkConfig {

    @Value("${spring.jpa.database-platform}")
    private String databasePlatform;

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource) {
        Map<String, Object> properties = new HashMap<>();
        properties.put("jakarta.persistence.schema-generation.database.action", "create");
        properties.put("eclipselink.logging.level", "FINE");
        properties.put("eclipselink.weaving", "false");
        properties.put("eclipselink.ddl-generation.output-mode", "database");

        LocalContainerEntityManagerFactoryBean factory = new LocalContainerEntityManagerFactoryBean();
        factory.setDataSource(dataSource);
        factory.setPackagesToScan("com.lab1.lab1");
        factory.setPersistenceProviderClass(PersistenceProvider.class);
        factory.setJpaPropertyMap(properties);
        factory.setPersistenceUnitName("workersPU");
        return factory;
    }

    @Bean
    public PlatformTransactionManager transactionManager(EntityManagerFactory emf) {
        return new JpaTransactionManager(emf);
    }
}
