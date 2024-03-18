const itemsList = document.querySelector('.items__list'),
      cartCounter = document.querySelector('.cart__counter'),
      popupTrigger = document.querySelector('.popup__trigger'),
      popup = document.querySelector('.popup')
      popupClose = document.querySelector('.popup__close'),
      cartList = document.querySelector('.order__list')

itemsList.innerHTML = '<p>Please wait...</p>'

fetch('https://fakestoreapi.com/products')
.then(res => res.json())
.then(res => {
    itemsList.innerHTML = ''
    res.forEach((item) => {
        itemsList.innerHTML += `
        <article 
            class="shopping__item"
            style="background-image: url(${item.image});"
        >
        <div class="item__content">
            <h1 class="item__name">${item.title}</h1>
            <p class="item__description">
            ${item.description.substring(0, 270)}...
            </p>
            <p>$${item.price}</p>
            <button id="${item.id}" class="item__button">Buy</button>
        </div>
        </article>
        `
    })
})
.catch(() => {
    itemsList.innerHTML = '<p>Something went wrong...</p>'
})

itemsList.addEventListener('click', async (e) => {
    if (e.target.closest('.item__button')) {
        const id = +e.target.getAttribute('id') 

        const cart = JSON.parse(localStorage.getItem('cart')) || []

        if(cart?.find(el => el.id === id)) {
            cart.find(el => el.id === id).count += 1
            localStorage.setItem('cart', JSON.stringify(cart))
            cartCounter.innerText = +cartCounter.innerText + 1

            return
        }

        await fetch(`https://fakestoreapi.com/products/${id}`)
        .then(res => res.json())
        .then(res => {
            cart.push({...res, count: 1})
            localStorage.setItem('cart', JSON.stringify(cart))
            cartCounter.innerText = +cartCounter.innerText + 1

            return
        })
    }
})

function countAllItems (element) {
    const cart = JSON.parse(localStorage.getItem('cart')) || []
    let count = 0

    if(cart.length === 0) {
        element.innerText = count
        return
    }

    cart.forEach(item => {
        count += item.count
    })

    element.innerText = count
}

countAllItems(cartCounter)

popupTrigger.addEventListener('click', () => {
    popup.classList.add('active')
    showCartList()
})

popupClose.addEventListener('click', () => {
    popup.classList.remove('active')
})

popup.addEventListener('click', (e) => {
    if (e.target.classList[0] == 'popup') {
        popup.classList.remove('active')
    }
})

function showCartList () {
    const cart = JSON.parse(localStorage.getItem('cart')) || []

    if (cart.length === 0) {
        cartList.innerHTML = '<h1>Order something!</h1>'
        return
    }
    
    cartList.innerHTML = ''

    cart.forEach((cartElem) => {
        cartList.innerHTML += `
            <li>
                <image src="${cartElem.image}" height=50 />
                <h3>${cartElem.title.substring(0, 30)}</h3>
                <p>$${(cartElem.price*cartElem.count+ '').substring(0, 7)}</p>
                <div class="element__actions">
                    <button id="${cartElem.id}" class="action__button">+</button>
                    <p>${cartElem.count}</p>
                    <button id="${cartElem.id}" class="action__button">-</button>
                    <button id="${cartElem.id}" class="action__button">🗑</button>
                </div>
            </li>
        `
    })
}

cartList.addEventListener('click', (e) => {
    if (e.target.closest('.action__button')) {
        changeCartItems(e.target.innerHTML, +e.target.getAttribute('id'))
    }
})

function changeCartItems(action, id) {
    const cart = JSON.parse(localStorage.getItem('cart')) || []


    switch (action) {
        case '+':
            cart.find(el => el.id === id).count += 1
            break
        case '-':
            cart.find(el => el.id === id).count -= 1
            if (cart.find(el => el.id === id).count === 0) {
                deleteItem()
            }
            break
        case '🗑':
            deleteItem()
            break
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    showCartList()
    countAllItems(cartCounter)

    function deleteItem () {
        cart.splice(cart.findIndex(el => el.id === id), 1)
    }
}