import {getStorage, removeStorage} from './serviseStorage.js';

const cartList = document.querySelector('.cart__list');
const cart = document.querySelector('.cart');
const selectAll = document.querySelector('#select-all');
const checkboxes = document.getElementsByName('prod');
const inputs = document.getElementsByName('count');

const headerCount = document.querySelector('.icons__header-count');
const cartCount = document.querySelector('.cart__title-count');

const totalPriceControl = () => {
    const data = getStorage('dataArr');
    const resultGoodsCount = document.querySelector('.result__goods-count');
    const resultGoodsPrice = document.querySelector('.result__goods-price');
    const resultSale = document.querySelector('.result__sale-total');
    const resultTotal = document.querySelector('.result__total');

    let sum = 0;
    let sumSale = 0;
    let count = 0;

    if (inputs.length === data.length) {
        for (let i = 0; i < data.length; i++) {
            count += +inputs[i].value;
            resultGoodsCount.textContent = `Товары, ${count}  шт.`;
            cartCount.textContent = count;
            headerCount.textContent = count;

            sum += +data[i].price * inputs[i].value;
            resultGoodsPrice.textContent = `${sum} ₽`;

            sumSale += ((+data[i].price / 100) * +data[i].discount) * inputs[i].value;
            resultSale.textContent = `${sumSale} ₽`;

            resultTotal.textContent = sum - sumSale;
        }
    }
};

const countControl = async (minus, number, plus, input, priceAct, priceOld, priceCredit) => {
    let n = +number.textContent;
    const act = +priceAct.textContent;
    const old = +priceOld.textContent;

    plus.addEventListener('click', () => {
        n += 1;
        number.textContent = n;
        input.value = n;
        priceAct.textContent = act * n;
        priceOld.textContent = old > 0 ? old * n : '';
        priceCredit.textContent = `В кредит от ${Math.floor(+priceAct.textContent / 12)} ₽`;

        totalPriceControl();
    });

    minus.addEventListener('click', () => {
        if (n > 1) {
            n -= 1;
            number.textContent = n;
            input.value = n;
            priceAct.textContent = act * n;
            priceOld.textContent = old > 0 ? old * n : '';
            priceCredit.textContent = `В кредит от ${Math.floor(+priceAct.textContent / 12)} ₽`;

            totalPriceControl();
        }
    });
};

const renderCount = (priceAct, priceOld, priceCredit, id) => {
    const itemCount = document.createElement('div');
    itemCount.classList.add('item__count', 'count');
    const minus = document.createElement('button');
    minus.classList.add('count__item', 'count__minus');
    minus.textContent = '-';
    const number = document.createElement('span');
    number.classList.add('count__number');
    number.textContent = '1';
    const plus = document.createElement('button');
    plus.classList.add('count__item', 'count__plus');
    plus.textContent = '+';

    const input = document.createElement('input');
    input.classList.add('count__input');
    input.type = 'hidden';
    input.name = 'count';
    input.value = +number.textContent;

    itemCount.append(minus, number, plus, input);

    countControl(minus, number, plus, input, priceAct, priceOld, priceCredit);

    return itemCount;
};

const createCartItem = (title, price, discount, imgUrl, id) => {
    const li = document.createElement('li');
    li.classList.add('cart__item', 'item');
    li.dataset.prodId = `${id}`;

    const itemPhoto = document.createElement('div');
    itemPhoto.classList.add('item__photo');

    const checkbox = document.createElement('input');
    checkbox.classList.add('item__checkbox', 'checkbox__input');
    checkbox.type = 'checkbox';
    checkbox.id = `prod-${id}`;
    checkbox.dataset.id = `${id}`;
    checkbox.name = 'prod';
    const label = document.createElement('label');
    label.classList.add('cart__label');
    label.setAttribute('for', `prod-${id}`);
    label.innerHTML = `
        <img src="${imgUrl}" alt="${title}" class="item__image">
    `;

    itemPhoto.append(checkbox, label);

    const itemContent = document.createElement('div');
    itemContent.classList.add('item__content');
    itemContent.innerHTML = `
        <div class="item__content">
            <div class="item__title">${title}</div>
            <div class="item__vendor-code">
                <span class="item__article">Артикул</span>
                <span class="item__id">${id}</span>
            </div>
        </div>
    `;

    const itemTotal = document.createElement('div');
    itemTotal.classList.add('item__total');

    const priceAct = document.createElement('p');
    priceAct.classList.add('item__price');
    priceAct.textContent = `${discount > 0 ? price - ((price / 100) * discount) : price}`;

    const priceOld = document.createElement('p');
    priceOld.classList.add('item__price-old');
    priceOld.textContent = `${discount > 0 ? price : ''}`;

    const priceCredit = document.createElement('p');
    priceCredit.classList.add('item__price-credit');
    priceCredit.textContent = `В кредит от ${Math.floor(price / 12)} ₽`;

    itemTotal.append(priceAct, priceOld, priceCredit);

    const btnDelMin = document.createElement('button');
    btnDelMin.classList.add('cart__delete', 'cart__delete-min');
    btnDelMin.innerHTML = `
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.0214 5.35355L19.1679 5.5H19.375H23.25V7H6.75V5.5H10.625H10.8321L10.9786 5.35355L12.0821 4.25H17.9179L19.0214 5.35355ZM10 25.75C8.90114 25.75 8 24.8489 8 23.75V9.25H22V23.75C22 24.8489 21.0989 25.75 20 25.75H10Z" fill="#C9C9C9" stroke="#C9C9C9"/>
        </svg>
    `;

    const itemCount = renderCount(priceAct, priceOld, priceCredit, id);

    li.append(itemPhoto, itemContent, itemCount, itemTotal, btnDelMin);
    cartList.append(li);

    return li;
};


const selectControl = () => {
    selectAll.addEventListener('change', () => {
        if (selectAll.checked === true) {
            for (const checkbox of checkboxes) {
                checkbox.checked = true;
            }
        } else {
            for (const checkbox of checkboxes) {
                checkbox.checked = false;
            }
        }
    });
};

const deleteControl = () => {
    cart.addEventListener('click', ({target}) => {
        if (target.closest('.cart__delete')) {
            for (const checkbox of checkboxes) {
                if (checkbox.checked === true) {
                    const prodId = checkbox.dataset.id;
                    const li = document.querySelector(`[data-prod-id="${prodId}"]`);
                    removeStorage(prodId);
                    li.remove();
                    totalPriceControl();
                }
            }
        }
    });
};


export const cartControl = async () => {
    cartList.textContent = '';
    const dataCartArr = getStorage('dataArr');

    dataCartArr.map(item => {
        const title = item.title;
        const price = item.price;
        const discount = item.discount;
        const id = item.id;
        let imgUrl = `https://jumpy-global-capricorn.glitch.me/${item.image}`;
        if (item.image === 'image/notimage.jpg') {
            imgUrl = 'img/unsplash.jpg';
        }

        createCartItem(title, price, discount, imgUrl, id);
    });

    totalPriceControl();
    selectControl();
    deleteControl();
};
