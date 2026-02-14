package com.apex.portfolio.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/dashboard")
    public String dashboard() {
        return "forward:/index.html";
    }

    // Also map root context explicitly if needed, though default static handling
    // usually covers it
    @GetMapping("/")
    public String root() {
        return "forward:/index.html";
    }
}
