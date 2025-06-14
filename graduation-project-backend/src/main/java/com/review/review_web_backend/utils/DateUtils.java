package com.review.review_web_backend.utils;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class DateUtils {

    // Chuyển đổi từ chuỗi dd/MM/yyyy sang Instant
    public static Instant parseToInstant(String date) {
        if (date == null || date.isEmpty()) {
            // Nếu không có date, không nên trả về ngày hiện tại mà trả về null
            return null;
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        LocalDate localDate = LocalDate.parse(date, formatter);
        ZonedDateTime timeInstant = localDate.atStartOfDay(ZoneId.systemDefault());
        return timeInstant.toInstant();
    }

    // Chuyển đổi từ Instant sang chuỗi dd/MM/yyyy
    public static String parseToLocalDate(Instant dateTime) {
        if (dateTime == null) {
            return "";  // Trả về chuỗi rỗng nếu dateTime là null
        }
        LocalDate localDate = dateTime.atZone(ZoneId.systemDefault()).toLocalDate();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return localDate.format(formatter);
    }
}
