package com.review.review_web_backend.validations;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PhoneNumberStructure.class)
@Target( { ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)

public @interface PhoneNumberAnnotation {
    String message() default "PhoneNumber must be validate !";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}