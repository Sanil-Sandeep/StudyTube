package com.skillsharing;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@SpringBootApplication
@EnableMongoAuditing
@ComponentScan(basePackages = {"com.skillsharing"})
public class SkillSharingApplication {
    private final RequestMappingHandlerMapping requestMappingHandlerMapping;

    public SkillSharingApplication(RequestMappingHandlerMapping requestMappingHandlerMapping) {
        this.requestMappingHandlerMapping = requestMappingHandlerMapping;
    }

    public static void main(String[] args) {
        SpringApplication.run(SkillSharingApplication.class, args);
    }

    @EventListener
    public void onApplicationEvent(ApplicationReadyEvent event) {
        System.out.println("\n=== Mapped URLs ===\n");
        requestMappingHandlerMapping.getHandlerMethods().forEach((key, value) -> {
            System.out.println(key + " => " + value);
        });
        System.out.println("\n=== End of Mapped URLs ===\n");
    }
}
