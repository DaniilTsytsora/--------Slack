// Импорт необходимых файлов и библиотек
import express from 'express';
import mongoose from 'mongoose';
import router from '../src/routes/router';
import fetch from 'isomorphic-fetch';
import cron from 'node-cron';
import { WebClient } from '@slack/web-api';
const PORT = 5000;
const URL_DB = 'mongodb://127.0.0.1:27017/';
const app = express();
// Работа с роутером и парс JSON
app.use(express.json());
app.use(router);

// Запуск сервера
async function startApp() {
  try {
    await mongoose.connect(URL_DB);
    app.listen(PORT, () => console.log(`Server working on PORT ${PORT}`));
  } catch (e) {
    console.log(e);
  }
}

startApp();
// Отправка в полночь(00:00) текущей даты и проверка POST запросом в БД сотрудников с их birthdays и вся работа в целом
const startCron = () => {
  cron.schedule('0 0 * * * *', async () => {
    console.log('Cron started');
    const date = new Date().toLocaleDateString('ru-RU');
    console.log(date);
    const response = await fetch('http://localhost:5000/birthdays', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date }),
    });
    // Записываем полученный JSON в ответ на POST запрос с датой
    const data = await response.json();
    // Функция поиска руководителя в рабочем пространстве по email
    const getUserIdByEmail = async (slackClient, name) => {
      try {
        const response = await slackClient.users.list({ include_locale: true });
        const user = response.members.find(
          (member) => member.profile.email == name
        );
        return user.id;
      } catch (error) {
        console.error(error);
      }
    };
    // Подключение бота, получение ID руководителя для отправки сообщений ему от бота в личные сообщения, получение и обработка сотрудников с ДР. Отправка сообщений руководителю
    for (const manager of data.managers) {
      const slackClient = new WebClient(
        'xoxb-5261949221667-5274880553985-dV1aRT7A5ZFTkAlS36wGhEkS'
      );
      const email = manager.rukovoditel;
      const rukid = await getUserIdByEmail(slackClient, email);
      const employeeNames = manager.sotrudniki
        .filter((employee) => employee.birthday === date)
        .map((employee) => employee.name);
      // Обработка, если ДР сегодня ни у кого нет
      if (employeeNames.length === 0) {
        continue;
      }
      const message = `Сегодня день рождения у вашего сотрудника: ${employeeNames.join(
        ', '
      )}`;

      await slackClient.chat.postMessage({
        channel: rukid,
        text: message,
      });
    }
  });
};

startCron();
