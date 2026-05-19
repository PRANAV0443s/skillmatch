package com.skillmatch.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:no-reply@skillmatch.com}")
    private String fromEmail;

    public void sendApplicationConfirmation(String toEmail, String userName, String jobTitle, String companyName, String status, int matchScore) {
        System.out.println("Email Service: Attempting to send email FROM: " + fromEmail + " TO: " + toEmail);
        if (mailSender == null) {
            System.out.println("Email Service: SMTP not configured (JavaMailSender is null). Mock Email to: " + toEmail);
            System.out.println("Subject: Job Application Submitted Successfully");
            System.out.println("Body: Hello " + userName + ", your application for " + jobTitle + " at " + companyName + " was " + status + " with a match score of " + matchScore + "%.");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Job Application Confirmation - " + jobTitle);
            
            String htmlContent = String.format(
                "<html>" +
                "<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>" +
                "  <div style='max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;'>" +
                "    <div style='background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); padding: 20px; text-align: center; color: white;'>" +
                "      <h1 style='margin: 0;'>SkillMatch</h1>" +
                "      <p style='margin: 5px 0 0;'>Your Blockchain-Verified Career Partner</p>" +
                "    </div>" +
                "    <div style='padding: 30px;'>" +
                "      <h2>Application Successfully Submitted!</h2>" +
                "      <p>Hello <strong>%s</strong>,</p>" +
                "      <p>Congratulations! Your application for the following position has been successfully received through the SkillMatch portal.</p>" +
                "      " +
                "      <div style='background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;'>" +
                "        <h3 style='margin-top: 0; color: #764ba2;'>Application Summary</h3>" +
                "        <p><strong>Job Title:</strong> %s</p>" +
                "        <p><strong>Company:</strong> %s</p>" +
                "        <p><strong>Current Status:</strong> <span style='background: #e1f5fe; color: #01579b; padding: 2px 8px; border-radius: 10px;'>%s</span></p>" +
                "        <p><strong>Skill Match Score:</strong> <span style='color: #2e7d32; font-weight: bold;'>%d%%</span></p>" +
                "      </div>" +
                "      " +
                "      <p>Your verified profile and blockchain-secured resume have been shared with the hiring team. This ensures your credentials are 100%% authentic and gives you a competitive edge.</p>" +
                "      " +
                "      <p>We will notify you of any further updates regarding your application status.</p>" +
                "      " +
                "      <div style='margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;'>" +
                "        <p>Best regards,<br><strong>The SkillMatch Team</strong></p>" +
                "      </div>" +
                "    </div>" +
                "    <div style='background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777;'>" +
                "      &copy; 2026 SkillMatch Inc. | Powered by Blockchain Technology" +
                "    </div>" +
                "  </div>" +
                "</body>" +
                "</html>",
                userName, jobTitle, companyName != null ? companyName : "Not Specified", status, matchScore
            );

            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("Confirmation email sent successfully to: " + toEmail);
        } catch (Exception e) {
            System.err.println("CRITICAL: Failed to send application confirmation email to " + toEmail);
            System.err.println("Error details: " + e.getMessage());
        }
    }
}

