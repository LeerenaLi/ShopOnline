const createTimer = (timerBlock) => {
    timerBlock.insertAdjacentHTML('beforeend', `
        <p class="timer__title">До конца акции:</p>
        <div class="timer__item timer__item_days">
            <p class="timer__count timer__count_days"></p>
            <p class="timer__units timer__units_days"></p>
        </div>
        <div class="timer__item timer__item_hours">
            <p class="timer__count timer__count_hours"></p>
            <p class="timer__units timer__units_hours"></p>
        </div>
        <div class="timer__item timer__item_minutes">
            <p class="timer__count timer__count_minutes"></p>
            <p class="timer__units timer__units_minutes"></p>
        </div>
    `);
};


const timer = (deadline, timerBlock) => {
    const endAction = document.querySelector('.end-action');

    const timerCountDays = document.querySelector('.timer__count_days');
    const timerCountHours = document.querySelector('.timer__count_hours');
    const timerCountMinutes = document.querySelector('.timer__count_minutes');

    const timerUnitsDays = document.querySelector('.timer__units_days');
    const timerUnitsHours = document.querySelector('.timer__units_hours');
    const timerUnitsMinutes = document.querySelector('.timer__units_minutes');

    const getTimeRemaining = () => {
        const dateStop =
            new Date(new Date(deadline).getTime() + 3 * 3600 * 1000); // +3 часа

        const dateNow = Date.now();

        const timeRemaining = dateStop - dateNow;
        // получили время формата таймстемп

        const minutes = Math.floor(timeRemaining / 1000 / 60 % 60);
        const hours = Math.floor(timeRemaining / 1000 / 60 / 60 % 24);
        const days = Math.floor(timeRemaining / 1000 / 60 / 60 / 24);

        return {timeRemaining, minutes, hours, days};
    };

    // склонение:
    const declension = (number, txt, cases = [2, 0, 1, 1, 1, 2]) =>
        txt[(number % 100 > 4 && number % 100 < 20) ? 2 :
            cases[(number % 10 < 5) ? number % 10 : 5]];


    const start = () => {
        const timer = getTimeRemaining();

        timerCountDays.textContent = timer.days;
        timerCountHours.textContent = timer.hours;
        timerCountMinutes.textContent = timer.minutes;

        timerUnitsDays.textContent =
            declension(timer.days, ['день', 'дня', 'дней']);
        timerUnitsHours.textContent =
            declension(timer.hours, ['час', 'часа', 'часов']);
        timerUnitsMinutes.textContent =
            declension(timer.minutes, ['минута', 'минуты', 'минут']);

        const interbalId = setTimeout(start, 1000);

        if (timer.timeRemaining < 86400000) {
            timerBlock.classList.add('red');
        }

        if (timer.timeRemaining <= 0) {
            clearTimeout(interbalId);
            timerCountDays.textContent = '00';
            timerCountHours.textContent = '00';
            timerCountMinutes.textContent = '00';
            timerBlock.classList.add('delete');
            endAction.classList.remove('delete');
        }
    };

    start();
};


export const startTimer = (selectorTimer) => {
    const timerBlock = document.querySelector(selectorTimer);

    const deadline = timerBlock.getAttribute('data-timer-deadline');

    createTimer(timerBlock);

    timer(deadline, timerBlock);
};

