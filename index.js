// - vars
const addPizzaBtn = document.querySelector('#add-pizza-btn')
const menuBtn = document.querySelector('#pizza-menu-btn')
const addPizzaSection = document.querySelector('#add-pizza')
const menuSection = document.querySelector('#menu')
const pizzaList = document.querySelector('#pizza-list')
const form = document.querySelector('form')
const nameInput = document.querySelector('#name')
const priceInput = document.querySelector('#price')
const heatInput = document.querySelector('#heat')
let toppingsContainer = document.querySelector('.toppings-container')
const addToppingBtn = document.querySelector('#add-topping')
const photos = [...document.querySelectorAll('.photo')]
const sortBy = document.querySelector('#sort-by')
const error = document.querySelector('#error')
const noPizzas = document.querySelector('#no-pizzas')
let selectedPhoto = ''

// functions
const formReset = () => {
    nameInput.value = ''
    priceInput.value = ''
    heatInput.value = '0'
    selectedPhoto= ''
    photos.forEach(e => e.classList.remove('selected'))
    toppingsContainer.innerHTML = `
        <p>Toppings*</p>
        <input type="text" class='input topping-input' placeholder="Topping #1">
        <input type="text" class='input topping-input' placeholder="Topping #2">
    `
}

const submitForm = (name, price, photo, toppings, heat) => {
    const pizza = {
        name,
        price,
        photo,
        toppings,
        heat
    }
    let pizzas = JSON.parse(sessionStorage.getItem('pizzas')) || []
    pizzas = [...pizzas, pizza]
    sessionStorage.setItem('pizzas', JSON.stringify(pizzas))
    formReset()
}

const showPizzas = pizzas => {
    if (!pizzas) return noPizzas.style.display = 'block'
    pizzaList.innerHTML = ''
    noPizzas.style.display = 'none'
    pizzas.reverse().forEach(e => {
        const div = document.createElement('div')
        div.classList.add('pizza')

        const deleteBtn = document.createElement('button')
        deleteBtn.innerText = 'Delete'
        deleteBtn.classList.add('button')
        deleteBtn.classList.add('delete-btn')
        deleteBtn.addEventListener('click', () => {
            if (confirm(`Delete ${e.name}?`)) {
                const index = pizzas.indexOf(e)
                pizzas.splice(index, 1)
                sessionStorage.setItem('pizzas', JSON.stringify(pizzas))
                showPizzas(sort(sortBy.value, JSON.parse(sessionStorage.getItem('pizzas')) || null))
            } else return
        })

        const heatSpan = document.createElement('span')
        heatSpan.classList.add('chilli-container')
        for (let i = 0; i < e.heat; i++) {
            const chilli = document.createElement('img')
            chilli.src = './assets/chilli.png'
            heatSpan.appendChild(chilli)
        }

        const descriptionDiv = document.createElement('div')
        descriptionDiv.classList.add('description')
        descriptionDiv.innerHTML = `
            <h2>${e.name}</h2>
            <p>${e.price}€</p>
            <p>Toppings: ${e.toppings.reduce((a, c) => a += c + ', ', '').slice(0, -2)}</p>
        `

        descriptionDiv.querySelector('h2').appendChild(heatSpan)

        div.innerHTML = `<img src='${e.photo ? e.photo : './assets/no-photo.jpg'}' class='pizza-photo' alt='photo'>`

        descriptionDiv.appendChild(deleteBtn)
        div.appendChild(descriptionDiv)
        pizzaList.appendChild(div)
    })
}

const sort = (by, list) => {
    if (!list) return null
    return list.sort((a,b) => (+a[by] > +b[by]) ? 1 : ((+b[by] > +a[by]) ? -1 : 0)).reverse()
}


// events
photos.forEach(e => {
    e.addEventListener('click', () => {
        photos.forEach(e => e.classList.remove('selected'))
        e.classList.add('selected')
        selectedPhoto = `./assets/pizza${e.dataset.num}.jpg`
    })
})

addToppingBtn.addEventListener('click', () => {
    const newToppingInput = document.createElement('input')
    newToppingInput.type = 'text'
    newToppingInput.classList.add('input')
    newToppingInput.classList.add('topping-input')
    newToppingInput.placeholder = `Topping #${toppingsContainer.childElementCount}`
    toppingsContainer.appendChild(newToppingInput)
})

form.addEventListener('submit', event => {
    event.preventDefault()
    const dataFromStorage = JSON.parse(sessionStorage.getItem('pizzas')) || []
    const toppingIputs = [...document.querySelectorAll('.topping-input')]
    const toppings = []
    toppingIputs.forEach(e => e.value !== '' && toppings.push(e.value))
    const heat = heatInput.value
    let errorMsg = ''
    const filterForSameName = dataFromStorage.filter(e => e.name === nameInput.value)
    if (nameInput.value && priceInput.value && toppings.length >= 2 && filterForSameName.length === 0) {
        submitForm(nameInput.value, priceInput.value, selectedPhoto, toppings, heat)
        error.innerText = ''
    } else {
        if (filterForSameName.length > 0) errorMsg += 'pizza under this name already exists, '
        if (nameInput.value.length > 30) errorMsg += 'name max length is 30 chars, '
        if (!nameInput.value) errorMsg += 'enter name, '
        if (!priceInput.value) errorMsg += 'enter price, '
        if (toppings.length < 2) errorMsg += 'add at least 2 toppings, '
        errorMsg = errorMsg.charAt(0).toUpperCase() + errorMsg.slice(1)
        errorMsg = errorMsg.slice(0, -2)
        error.innerText = errorMsg
    }
})

addPizzaBtn.addEventListener('click', () => {
    addPizzaSection.style.display = 'block'
    menuSection.style.display = 'none'
    formReset()
})

menuBtn.addEventListener('click', () => {
    addPizzaSection.style.display = 'none'
    menuSection.style.display = 'block'
    showPizzas(sort(sortBy.value, JSON.parse(sessionStorage.getItem('pizzas')) || null))
})

sortBy.addEventListener('change', e => {
    showPizzas(sort(e.target.value, JSON.parse(sessionStorage.getItem('pizzas')) || null))
})