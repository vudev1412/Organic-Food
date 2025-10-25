package com.example.backend;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class DiscountCalculatorTest {
    @Test
    public void testDiscount(){
        DiscountCalculator discount = new DiscountCalculator();
        double total = discount.calculatorDiscount(50);
        assertEquals(0,total);
    }

    @Test
    public void test10Discount(){
        DiscountCalculator discount = new DiscountCalculator();
        double total = discount.calculatorDiscount(150);
        assertEquals(15,total);
    }

    @Test
    public void test20Discount(){
        DiscountCalculator discount = new DiscountCalculator();
        double total = discount.calculatorDiscount(600);
        assertEquals(120,total);
    }
}
