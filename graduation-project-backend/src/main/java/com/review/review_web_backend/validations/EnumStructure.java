package com.review.review_web_backend.validations;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

public class EnumStructure implements ConstraintValidator<EnumAnnotation,Enum<?>> {
    private Pattern pattern;

    @Override
    public void initialize(EnumAnnotation enumPattern) {
        try {
            // Biên dịch regexp đã cho và trả về thể hiện of pattern
            pattern = Pattern.compile(enumPattern.regexp());
        } catch (PatternSyntaxException e) {
            throw new IllegalArgumentException("Given regex is invalid", e);
        }
    }

    @Override
    public boolean isValid(Enum<?> value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }

        // So sánh xem chuỗi dữ liệu đầu vào có = chuỗi pattern dc tạo trước ở trên ko
        Matcher m = pattern.matcher(value.name());
        return m.matches();
    }

}
