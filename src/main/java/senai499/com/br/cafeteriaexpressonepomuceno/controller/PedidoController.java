package senai499.com.br.cafeteriaexpressonepomuceno.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PedidoController {

    @GetMapping("/pedidos")
    public String pedidos() {
        return "pedidos/pedidos";
    }

    @GetMapping("/cardapio")
    public String cardapio() {
        return "pedidos/cardapio";
    }
}