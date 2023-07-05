import {initBlog} from './blog.js';
import {menuControl} from './menu.js';
import {cardPageControl} from './renderCardPage.js';
import {cartControl} from './renderCart.js';
import {categoryControl} from './renderCategory.js';
import {discountGoodsConrtol} from './renderDiscontGoods.js';
import {startTimer} from './timer.js';

import {titleCard} from './renderCardPage.js';
import {getStorage} from './serviseStorage.js';

const headerCount = document.querySelector('.icons__header-count');
const cartTitle = document.querySelector('.cart__title');
const cartCount = document.querySelector('.cart__title-count');

{
    const init = () => {
        window.timerInit = startTimer;

        const arr = getStorage();
        headerCount.textContent = arr.length;
        if (cartTitle) {
            cartCount.textContent = headerCount.textContent;
        }

        menuControl();
        discountGoodsConrtol();
        categoryControl();
        if (titleCard) {
            cardPageControl();
        }
        if (cartTitle) {
            cartControl();
        }
        initBlog();
    };

    init();
}
