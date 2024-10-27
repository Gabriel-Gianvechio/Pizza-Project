
let cart = []; //array
let pizzaQt = 1; //number
let pizzaKey = 0 

//como vamos usar muitas vezes document.querySelector, então estamos criando uma função que Há substitui ela por um ' c '.
const c = (element) => document.querySelector(element);
const cs = (element) => document.querySelectorAll(element);


//LISTAGEM DAS PIZZAS
//passar as informações de pizzaJson para dentro da estrutura do HTML, onde a class pizza-item que vai receber as infos.
pizzaJson.map( ( item, index ) => { //vamos passar em item por item do array pizzaJson, ondem item é o próprio ITEM do array e INDEX é a posição dele no array (são 7 itens, então vai de 0 a 6)
    let pizzaItem = c('.models .pizza-item').cloneNode(true); //cloneNode vai clocar os elementos dentro da div pizza-item do HTML


    //adiciona a estrutura HTML na tela 
    c('.pizza-area').append(pizzaItem); //append mantem a estrutura da div (pizza-area) e adiciona mais um conteúdo


    //adiciona as infos na estrutura HTML
    pizzaItem.setAttribute('data-key', index); //criamos o atributo data-key que recebe o valor do index (numerando as pizzas de 0 a 6 para utilizarmos futuramente)
    pizzaItem.querySelector('.pizza-item--img img').src = item.img
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item a').addEventListener('click', (event) => {
        event.preventDefault(); // prevenir a ação natural, tag 'a' atualiza  a pagina e/ou leva para algum link
        let key = index; //guarda qual pizza foi selecionada
        //let key = e.target.closest('.pizza-item').getAttribute('data-key');
        pizzaQt = 1;
        pizzaKey = key;


       //adiciona as infos na janela que abre ao clicar na pizza desejada
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach( (size, sizeIndex) => {
            if (sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = pizzaQt;
       

        c('.pizzaWindowArea').style.display = 'flex'; //aparecer area da pizza
        c('.pizzaWindowArea').style.opacity = 0; 
        setTimeout( () => { //função timer para deixar o codigo async, exec opacity 0 e depois a opacity 1 (CSS com transition 0.5)
            c('.pizzaWindowArea').style.opacity = 1; 
        }, 500);
    });
});



// EVENTOS MODAL
//ativando botão CANCELAR para sair da área da pizza
function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout( () => {      
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
};

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach( (item) => {
    item.addEventListener('click', closeModal);
});
//o comando de cima é a mesma coisa que fazer:
// c('.pizzaInfo--cancelButton').addEventListener('click', closeModal);
// c('.pizzaInfo--cancelMobileButton').addEventListener('click', closeModal);

//também sai da área da pizza quando aperta ESC
document.addEventListener('keydown', escKey);
function escKey(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
};

//AUMENTA quantidade de pizzas
c('.pizzaInfo--qtmais').addEventListener('click', () => {
    c('.pizzaInfo--qt').innerHTML = ++pizzaQt;
});

//DIMINUI quantidade de pizzas
c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if(pizzaQt > 1){
        c('.pizzaInfo--qt').innerHTML = --pizzaQt;
    }
});

cs('.pizzaInfo--size').forEach( (size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

//
c('.pizzaInfo--addButton').addEventListener('click', () => {

    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key')); //peguei o tamanho (P, M ou G), outras infos ja tenho
    let identifier = pizzaJson[pizzaKey].id+'@'+size; //usaremos como identificador
    let verify = cart.findIndex( (item) => item.identifier == identifier); //verifica se já tem esse item no carrinho (se nao achar retorna -1)

    if (verify > -1) {
        cart[verify].qt += pizzaQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[pizzaKey].id,
            size,
            qt: pizzaQt
        });
    }

    closeModal();
    updateCart();
});


//ATUALIZAR CART
function updateCart(){

    //CARRINHO MOBILE
    c('.menu-openner span').innerHTML = cart.length;


    if(cart.length > 0){ 
        c('aside').classList.add('show'); //show foi configurado no CSS para mostrar o cart
        c('.cart').innerHTML = ''; //zera o conteúdo sempre que for adicionar uma nova pizza

        let subTotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){
            
            let pizzaItem = pizzaJson.find( (item) =>  item.id == cart[i].id); // procura no meu cart pelo ID da pizza e repasso os valores do pizzaJson daquele ID para minha variavel pizzaItem
            subTotal += pizzaItem.price * cart[i].qt;
            
            let cartItem = c('.models .cart--item').cloneNode(true);

            const pSize = ['P', 'M', 'G'];
            pizzaSize = pSize[cart[i].size];

            let pizzaName = `${pizzaItem.name} (${pizzaSize})`;
            
            cartItem.querySelector('.cart--item-name').innerHTML = pizzaName;
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () =>{
                cart[i].qt++;
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () =>{
                if (cart[i].qt > 1 ){
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });

            c('.cart').append(cartItem);

            desconto = subTotal * 0.1;
            total = subTotal - desconto; // ou total = subTotal * 0.9;

            c('.subtotal span:last-child').innerHTML = `R$ ${subTotal.toFixed(2)}`; // span:slast-child PQ TEM 2 SPAN DENTRO DA DIV, QUEREMOS O ULTIMO
            c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
            c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
        }
    } else{ 
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw'; // fecha no mobile tbm
    }
}

//ABRIR MENU MOBILE
c('.menu-openner').addEventListener('click', () => { 
    if (cart.length > 0) {
        c('aside').style.left = '0'; // o menu está com left 100vw no mobile, para sair totalmente da tela, para trazer ele pra tela só precisamos zerar onde ele inicia
    };
});

c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw';
});