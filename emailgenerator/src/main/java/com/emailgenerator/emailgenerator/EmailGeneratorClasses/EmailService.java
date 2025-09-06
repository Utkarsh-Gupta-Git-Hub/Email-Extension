package com.emailgenerator.emailgenerator.EmailGeneratorClasses;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class EmailService {

private final WebClient webClient;

@Value("${api.url}")
private String url;
@Value("${api.key}")
private String key;

    public EmailService(WebClient.Builder webClientBuilder) {
    this.webClient = webClientBuilder.build();
}

    //creating the prompt for the email
   public String aigenerateEmail(EmailDto emailDto) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a professional, well-structured email with the following details:")
      .append("\nTone: ").append(emailDto.getEmailTone())
      .append("\nContext: ").append(emailDto.getEmailContent())
      .append("\nThe email should include:")
      .append("\n1. A clear and concise subject line.")
      .append("\n2. A polite greeting (e.g., Dear [Name],).")
      .append("\n3. A well-organized body with proper paragraphs.")
      .append("\n4. A professional closing statement.")
      .append("\n5. A signature placeholder like [Your Name].")
      .append("\nEnsure the tone remains consistent and professional throughout.");

        //crafting the prompt for api        
        Map<String, Object> requestBody = Map.of(
                        "contents", new Object[] {
                            Map.of("parts", new Object[]{
                                    Map.of("text", prompt.toString())
                            })
                        }
                );

        //getting the response from api and extraction of result 
        String response=webClient.post().uri(url+key).header("Content-Type","application/json").bodyValue(requestBody).retrieve().bodyToMono(String.class).block();
        
        String emailresponse=emailResponse(response);
        System.out.println(emailresponse);
        return emailresponse;
    }

    //returning the response to the controller
    public String emailResponse(String response) {
    try{
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode root = objectMapper.readTree(response);
        return root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
        }catch(Exception e){
        return "Error : "+e.getMessage();
        }

}


    
}

