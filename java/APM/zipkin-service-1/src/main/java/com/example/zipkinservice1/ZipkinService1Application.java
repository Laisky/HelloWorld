package com.example.zipkinservice1;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.feign.EnableFeignClients;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.beans.factory.annotation.Value;


@SpringBootApplication
@EnableEurekaClient
@EnableFeignClients
public class ZipkinService1Application {

	public static void main(String[] args) {
		SpringApplication.run(ZipkinService1Application.class, args);
	}
}



@RestController
class ZipkinController {

	@Value("${spring.sleuth.sampler.percentage}")
	private float percentage;

	@Value("${eureka.client.serviceUrl.defaultZone}")
	private String url;

	@Autowired
	RestTemplate restTemplate;

	@Autowired
	AppDemo2API svc;

	@Bean
	public RestTemplate getRestTemplate() {
		return new RestTemplate();
	}

	private static final Logger LOG = Logger.getLogger(ZipkinController.class.getName());

	@RefreshScope
	@GetMapping(value = "/zipkin")
	public String zipkinService1() {
		LOG.info("Inside zipkinService 1");
		LOG.info(String.format(">>> this.percentage: %.3f", this.percentage));
		LOG.info(">>> eureka:" + this.url);

		String response = (String) restTemplate.exchange("http://zipkin-svc-2:8081/zipkin", HttpMethod.GET, null,
				new ParameterizedTypeReference<String>() {
				}).getBody();

		return "Hi..." + response;
	}

	@GetMapping("/zipkin-feign")
	public String zipkinFeign() {
		LOG.info("request for /zipkin-feign");

		String resp = svc.hello();
		return "Greetings from spring boot: " + resp;
	}
}

@FeignClient(name = "zipkin-svc-2")
interface AppDemo2API {

    @RequestMapping(value = "/zipkin", method = RequestMethod.GET)
    public String hello();

}
