package com.review.review_web_backend.validations;


import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class EmailStructure implements ConstraintValidator<EmailAnnotation,String> {
    @Override
    public void initialize(EmailAnnotation email) {
        System.out.println("email will be checked !!!");
    }

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email.matches("\\w+@gmail(.)(com$)")){
            return true;
        }else {
            return false;
        }
    }
}
