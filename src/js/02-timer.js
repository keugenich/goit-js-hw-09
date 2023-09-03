import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from "notiflix";

Notiflix.Notify.Init();

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
};

const datetimePicker = flatpickr("#datetime-picker", options);

const startButton = document.querySelector('[data-start]');
const daysElement = document.querySelector('[data-days]');
const hoursElement = document.querySelector('[data-hours]');
const minutesElement = document.querySelector('[data-minutes]');
const secondsElement = document.querySelector('[data-seconds]');

let countdownInterval;

datetimePicker.config.onClose.push((selectedDates, dateStr, instance) => {
    const selectedDate = selectedDates[0];
    const currentDate = new Date();

    if (selectedDate < new Date()) {
        Notiflix.Notify.Failure("Please choose a date in the future");
        startButton.disabled = true;
    } else {
        startButton.disabled = false;
    }
});

startButton.addEventListener('click', () => {
    const selectedDate = datetimePicker.selectedDates[0];
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
        Notiflix.Notify.Failure("Please choose a date in the future");
        return;
    }

    startButton.disabled = true;

    countdownInterval = setInterval(() => {
        const timeLeft = selectedDate - new Date();
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            updateTimerDisplay(0);
        } else {
            updateTimerDisplay(timeLeft);
        }
    }, 1000);
});

function updateTimerDisplay(timeLeft) {
    const { days, hours, minutes, seconds } = convertMs(timeLeft);
    daysElement.textContent = addLeadingZero(days);
    hoursElement.textContent = addLeadingZero(hours);
    minutesElement.textContent = addLeadingZero(minutes);
    secondsElement.textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor((ms % hour) / minute);
    const seconds = Math.floor((ms % minute) / second);

    return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return value.toString().padStart(2, '0');
}
