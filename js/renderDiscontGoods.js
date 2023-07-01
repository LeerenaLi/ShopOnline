import {createCard, getAllGoods} from './renderCategory.js';


const goodsListDiscount = document.querySelector('.goods__list_discount');

export const discountGoodsConrtol = async () => {
    if (goodsListDiscount) {
        const data = await getAllGoods();

        data.map((item, index) => {
            if (item.discount > 0) {
                const title = item.title;
                const price = item.price;
                const discount = item.discount;
                const id = item.id;
                let imgUrl = `https://jumpy-global-capricorn.glitch.me/${item.image}`;
                if (item.image === 'image/notimage.jpg') {
                    imgUrl = 'img/unsplash.jpg';
                }

                if (index < 8) {
                    const card = createCard(title, price, discount, imgUrl, id);
                    goodsListDiscount.append(card);
                }
            }
        });
    }
};
