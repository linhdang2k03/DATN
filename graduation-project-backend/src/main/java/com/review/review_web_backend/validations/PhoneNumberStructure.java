package com.review.review_web_backend.validations;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PhoneNumberStructure implements ConstraintValidator<PhoneNumberAnnotation,String> {
    @Override
    public void initialize(PhoneNumberAnnotation phoneNumber) {
        System.out.println();
    }

    @Override
    public boolean isValid(String phoneNumber , ConstraintValidatorContext context) {
        if (phoneNumber == null){
            return false ;
        }

        //validate phone numbers of format "0902345345"
        if (phoneNumber.matches("\\d{10}")){
            return true;
        }

        //validating phone number with -, . or spaces: 090-234-4567
        else if(phoneNumber.matches("\\d{3}[-\\.\\s]\\d{3}[-\\.\\s]\\d{4}")){
            return true;
        }

        else {
            return false ;
        }
    }
}
