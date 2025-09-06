package com.emailgenerator.emailgenerator.EmailGeneratorClasses;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/emails")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class EmailController {
    // @Autowired
    public EmailService emailService;
    @PostMapping("/generate")    
    public ResponseEntity<String> generateEmail(@RequestBody EmailDto emailDto) {
    String emailContent = emailService.aigenerateEmail(emailDto);
            return ResponseEntity.ok(emailContent);
        }
}
