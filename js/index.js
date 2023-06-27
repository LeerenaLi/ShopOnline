import {initBlog} from './blog.js';
import {menuControl} from './menu.js';
import {categoryControl} from './renderCategoryGoods.js';
import {startTimer} from './timer.js';

{
    const init = () => {
        window.timerInit = startTimer;

        menuControl();
        categoryControl();

        initBlog();
    };

    init();
}
