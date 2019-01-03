package hello;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    // @Value("${spring.application.name}")
    // private String appName;

    @Autowired
    private ApplicationContext applicationContext;

    @Autowired
    Environment env;

    @Bean
    public CommandLineRunner commandLineRunner(ApplicationContext ctx) {
        return args -> {

            System.out.println("Let's inspect the beans provided by Spring Boot:");

            String[] beanNames = ctx.getBeanDefinitionNames();
            Arrays.sort(beanNames);
            // for (String beanName : beanNames) {
            //     System.out.println(">> "+beanName);
            // }

            System.out.println("------------------------------------------------------");
            System.out.println(">> appname: "+applicationContext.getApplicationName());
            System.out.println(">> id: "+applicationContext.getId());
            System.out.println(">> profile: "+String.join(";", env.getActiveProfiles()));
        };
    }

}
