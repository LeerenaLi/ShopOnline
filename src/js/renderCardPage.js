import {createCard, getAllGoods} from './renderCategory.js';


const titleCard = document.querySelector('.card__title');
const categoryLink = document.querySelector('.bread__link_category');
const productLink = document.querySelector('.bread__link_product');
const cardPhoto = document.querySelector('.card__photo');
const cardDescription = document.querySelector('.card__text');
const book = document.querySelector('.book');
const goodsList = document.querySelector('.goods__list_desktop');
const goodsListMin = document.querySelector('.goods__list_desktop-min');

const getProduct = async (id) => {
    const url = new URL(`https://jumpy-global-capricorn.glitch.me/api/goods/${id}`);

    const response = await fetch(url);
    const data = await response.json();

    return data;
};

const createProductPhoto = (title, discount, imgUrl) => {
    if (discount > 0) {
        const label = document.createElement('div');
        label.classList.add('label', 'card__label');
        label.innerHTML = `<p class="card__sale">-${discount}%</p>`;
        cardPhoto.append(label);
    }

    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('card__image-wrapper');
    imageWrapper.innerHTML = `
        <img src="${imgUrl}"
            alt="${title}"
            class="card__img" width="757" height="427">
    `;
    cardPhoto.append(imageWrapper);
};

const createBook = (price) => {
    const bookWrapper = document.createElement('div');
    bookWrapper.classList.add('book__wrapper');

    bookWrapper.innerHTML = `
        <div class="book__price">
            <p class="book__price-act">${price} ₽</p>
        </div>
        <p class="book__blue-text">В кредит от ${Math.floor(price / 12)} ₽ </p> 
        <div class="book__buttons">
            <button class="book__btn btn">Добавить в корзину</button>
            <button class="book__favorite">
                <svg width="33" height="33" viewBox="0 0 33 33" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.6875 4.125C20.295 4.125 17.9987 5.23875 16.5 6.99875C15.0012 5.23875 12.705 4.125 10.3125 4.125C6.0775 4.125 2.75 7.4525 2.75 11.6875C2.75 16.885 7.425 21.12 14.5062 27.555L16.5 29.3563L18.4937 27.5413C25.575 21.12 30.25 16.885 30.25 11.6875C30.25 7.4525 26.9225 4.125 22.6875 4.125ZM16.6375 25.5062L16.5 25.6437L16.3625 25.5062C9.8175 19.58 5.5 15.6613 5.5 11.6875C5.5 8.9375 7.5625 6.875 10.3125 6.875C12.43 6.875 14.4925 8.23625 15.2212 10.12H17.7925C18.5075 8.23625 20.57 6.875 22.6875 6.875C25.4375 6.875 27.5 8.9375 27.5 11.6875C27.5 15.6613 23.1825 19.58 16.6375 25.5062Z"/>
                </svg>
            </button>
        </div>
        <div class="book__info">
            <div class="book__delivery">
                <p class="book__info-light">Доставка</p>
                <p class="book__info-dark">1-3 августа</p>
            </div>
            <div class="book__seller">
                <p class="book__info-light">Продавец</p>
                <p class="book__info-dark">ShopOnline</p>
            </div>
        </div>
        <a href="#" class="book__sales">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13.586V10C19 6.783 16.815 4.073 13.855 3.258C13.562 2.52 12.846 2 12 2C11.154 2 10.438 2.52 10.145 3.258C7.185 4.074 5 6.783 5 10V13.586L3.293 15.293C3.19996 15.3857 3.12617 15.4959 3.07589 15.6172C3.0256 15.7386 2.99981 15.8687 3 16V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H20C20.2652 19 20.5196 18.8946 20.7071 18.7071C20.8946 18.5196 21 18.2652 21 18V16C21.0002 15.8687 20.9744 15.7386 20.9241 15.6172C20.8738 15.4959 20.8 15.3857 20.707 15.293L19 13.586ZM19 17H5V16.414L6.707 14.707C6.80004 14.6143 6.87383 14.5041 6.92412 14.3828C6.9744 14.2614 7.00019 14.1313 7 14V10C7 7.243 9.243 5 12 5C14.757 5 17 7.243 17 10V14C17 14.266 17.105 14.52 17.293 14.707L19 16.414V17ZM12 22C12.6193 22.0008 13.2235 21.8086 13.7285 21.4502C14.2335 21.0917 14.6143 20.5849 14.818 20H9.182C9.38566 20.5849 9.76648 21.0917 10.2715 21.4502C10.7765 21.8086 11.3807 22.0008 12 22Z"/>
            </svg>
            <p class="book__blue-text">Узнать о снижении цены</p>    
        </a>
    `;

    return bookWrapper;
};


export const cardPageControl = async () => {
    const params = new URL(document.location).searchParams;
    const productId = params.get('id');

    if (titleCard) {
        const dataProduct = await getProduct(productId);

        const discount = dataProduct.discount;
        const title = dataProduct.title;
        const category = dataProduct.category;
        const id = dataProduct.id;
        const image = dataProduct.image;
        const description = dataProduct.description;
        const price = dataProduct.price;

        titleCard.textContent = title;
        categoryLink.textContent = category;
        categoryLink.href = `categories.html?category=${category}`;
        productLink.textContent = title;
        productLink.href = `card-page.html?id=${id}`;

        let imgUrl = `https://jumpy-global-capricorn.glitch.me/${image}`;
        if (image === 'image/notimage.jpg') {
            imgUrl = 'img/unsplash.jpg';
        }

        const photo = createProductPhoto(title, discount, imgUrl);

        cardDescription.textContent = description;

        const bookWrapper = createBook(price);
        book.append(bookWrapper);

        // рекомендованные товары
        const data = await getAllGoods(); // временно все товары, сделать по категориям
        console.log('data: ', data);

        data.map((item, index) => {
            const title = item.title;
            const price = item.price;
            const discount = item.discount;
            const id = item.id;
            let imgUrl = `https://jumpy-global-capricorn.glitch.me/${item.image}`;
            if (item.image === 'image/notimage.jpg') {
                imgUrl = 'img/unsplash.jpg';
            }

            if (index < 4) {
                const card = createCard(title, price, discount, imgUrl, id);
                goodsList.append(card);
            }
            if (index < 6) {
                const card = createCard(title, price, discount, imgUrl, id);
                goodsListMin.append(card);
            }
        });
    }
};
