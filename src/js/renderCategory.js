const titleCategory = document.querySelector('.goods__title_category');
const listCategory = document.querySelector('.goods__list_category');

export const getAllGoods = async () => {
    const url = new URL(`https://jumpy-global-capricorn.glitch.me/api/goods/`);
    // получаю все товары
    const response = await fetch(url);
    const data = await response.json();

    return data;
};

export const createCard = (title, price, discount, imgUrl, id) => {
    const liItem = document.createElement('li');
    liItem.classList.add('goods__item');
    liItem.innerHTML = `
        <a href="card-page.html?id=${id}" class="goods__content">
            <div class="goods__image-wrapper_category">
                <img src="${imgUrl}"
                alt="${title}"
                class="goods__img_category" width="420" height="295">
            </div>    
            <div class="goods__prices">
                <p class="goods__price">${price} ₽</p>
            </div>
            <p class="goods__description">${title}</p>
        </a>
    `;

    if (discount > 0) {
        const label = document.createElement('div');
        label.classList.add('label', 'label__goods', 'label_bottom-left');
        label.innerHTML = `
            <p class="label__title label__title_goods">-${discount}%</p>
        `;
        liItem.append(label);
    }

    return liItem;
};

export const categoryControl = async () => {
    const params = new URL(document.location).searchParams;
    const pageCategory = params.get('category');

    if (titleCategory) {
        titleCategory.textContent = pageCategory;

        const dataGoods = await getAllGoods();

        dataGoods.map(item => {
            if (item.category === pageCategory) {
                // фильтрую по категории
                const title = item.title;
                const price = item.price;
                const discount = item.discount;
                const id = item.id;
                let imgUrl = `https://jumpy-global-capricorn.glitch.me/${item.image}`;
                if (item.image === 'image/notimage.jpg') {
                    imgUrl = 'img/unsplash.jpg';
                }

                const card = createCard(title, price, discount, imgUrl, id);
                listCategory.append(card);
            }
        });
    }
};
