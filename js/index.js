import {initBlog} from './blog.js';
import {menuControl} from './menu.js';
import {cardPageControl} from './renderCardPage.js';
import {categoryControl} from './renderCategory.js';
import {discountGoodsConrtol} from './renderDiscontGoods.js';
import {startTimer} from './timer.js';

{
    const init = () => {
        window.timerInit = startTimer;

        menuControl();
        discountGoodsConrtol();
        categoryControl();
        cardPageControl();

        initBlog();
    };

    init();
}
