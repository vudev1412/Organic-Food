package com.example.backend;

public class DiscountCalculator {
    public double calculatorDiscount(double totalDiscount){
        if(totalDiscount < 100){
            return 0;
        }else if(totalDiscount < 500){
            return totalDiscount * 0.10;
        }else{
            return totalDiscount * 0.20;
        }
    }
}
