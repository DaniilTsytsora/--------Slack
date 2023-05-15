// Импорт необходимых файлов и библиотек
import { Request, Response } from 'express';
import { ManagerModel } from '../models/schema';
// Функция для API POST запроса, для добавления руководителя с их сотрудниками в БД
export const addDB = async (req: Request, res: Response) => {
  try {
    const { rukovoditel, sotrudniki } = req.body;
    const manager = new ManagerModel({ rukovoditel, sotrudniki });
    await manager.save();
    res.status(200).json(manager);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: 'error' });
  }
};
// Функция для API POST запроса, для получения полного JSONa, в котором у сотрудника ДР.
export const checkBirthday = async (req: Request, res: Response) => {
  try {
    const { date } = req.body;
    console.log(date);

    const managers = await ManagerModel.find({
      'sotrudniki.birthday': date,
    }).exec();

    res.json({ managers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
