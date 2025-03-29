Function: Movie ticket booking - movie and time selection

    Scenario: Session time selection is required
        Given user is on "/navigation" page
        When user searches for "17:00", clicks
        Then user goes to the booking page and sees the title of the proposed movie "Унесенные ветром" and the session start time, hall



//Функция: Бронирование билетов в кино
//Сценарий: Необходимо выбрать свободное место для бронирования билетов на фильм "Унесенные ветром" Сегодня в 17:00
//Пользователь находится на странице "/идём в кино"
//Когда пользователь нажимает на свободное место стандарт "buying-scheme__chair buying-scheme__chair_standart buying-scheme__chair_selected"
//Затем пользователь нажимает на кнопку "ЗАБРОНИРОВАТЬ" и переходит на страницу https://qamid.tmweb.ru/client/payment.php

Function: Movie ticket booking

    Scenario: Need to select a free seat to book tickets for the movie "Унесенные ветром" on today at 17:00
        Given user is on "//https://qamid.tmweb.ru/client/hall.php" page 
        When the user clicks on a free seat standard "buying-scheme__chair buying-scheme__chair_standart buying-scheme__chair_selected"
        Then the user clicks on the "BOOK" button and goes to the page https://qamid.tmweb.ru/client/payment.php