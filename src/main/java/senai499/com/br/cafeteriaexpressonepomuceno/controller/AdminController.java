package senai499.com.br.cafeteriaexpressonepomuceno.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminController {

    @GetMapping("/login")
    public String login() {
        return "admin/senhaadm";
    }

    @GetMapping("/administrativo")
    public String admin() {
        return "admin/administrativo";
    }
}