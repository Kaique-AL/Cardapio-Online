const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const menu = document.getElementById('menu')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCounter = document.getElementById('cart-count')
const addressInput = document.getElementById('address'); 
const addressWarn = document.getElementById('address-warn'); 

let cart = []

//abrir o modal do carrinho
cartBtn.addEventListener('click', function() {
    updateCartModal();
    cartModal.style.display = "flex"
})


//fecvhar o modal quando clicar fora
cartModal.addEventListener('click', function(event) {
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

//fechar cart modal quando clicar no botão fechar
closeModalBtn.addEventListener('click', function() {
    cartModal.style.display = "none"
})

menu.addEventListener('click', function(event) {
    let parentButton = event.target.closest('.add-to-cart-btn')

    if(parentButton){
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))

        addToCart(name,price)
    }
})

//função para adicionar no carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        //se o item ja existe aumenta apenas a quantidade
        existingItem.quantity += 1;
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }


    updateCartModal();
}

//atualiza carrinho 
function updateCartModal(){
    cartItemsContainer.innerHTML = ""; // Limpa os itens do carrinho
    let total = 0;

    cart.forEach(item => {
        const cartItemsElement = document.createElement("div");
        cartItemsElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemsElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${(item.price * item.quantity).toFixed(2)}</p>
                </div>

                <div>
                    <button onclick="removeFromCart('${item.name}')" class="text-sm font-bold">Remover</button>
                </div>
            </div>
        `;

        total += item.price * item.quantity; // Acumula o total



        cartItemsContainer.appendChild(cartItemsElement);
    });

    cartTotal.textContent = ` R$ ${total.toFixed(2)}`; // Atualiza o total no modal

    cartCounter.innerHTML = cart.length;
}

// Função para remover itens do carrinho
function removeFromCart(name) {
    const itemIndex = cart.findIndex(item => item.name === name);
    if (itemIndex > -1) {
        cart[itemIndex].quantity -= 1;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1); // Remove o item se a quantidade for 0
        }
    }
    updateCartModal(); // Atualiza o modal após remover
}



// Adicionando o evento de input para o campo de endereço
addressInput.addEventListener("input", function() {
    addressWarn.classList.add("hidden"); // Esconde o aviso assim que o usuário digita
});

checkoutBtn.addEventListener("click", function() {

     const isOpen = checkRestauranteOpen();
     if(!isOpen){

        Toastify({
            text: "Ops o Restaurante está Fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
          }).showToast();

          return;
     }


    if(cart.length === 0) return;

    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden"); // Mostra o aviso se o campo estiver vazio
        addressInput.classList.add("border-red-500") //Aplica uma borda vermelha no input
        return;
    }

        //Enviar o pedido para api do whatsapp
        const cartItems = cart.map((item) => {
            return (
                ` ${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} |`
            )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "81596469"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart.length = 0;

    updateCartModal();
});


//Verificar se o restaurante esta aberto
function checkRestauranteOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 20;
    //treu = restaurante esta aberto
}

const spanItem = document.getElementById('date-span')
const isOpen = checkRestauranteOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}