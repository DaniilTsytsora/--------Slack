// Импорт необходимых файлов и библиотек
import * as express from 'express';
import { addDB } from '../main/main';
import { checkBirthday } from '../main/main';
// Роутеры для POST запросов
const router = express.Router();
router.post('/database', addDB);
router.post('/birthdays', checkBirthday);

export default router;
