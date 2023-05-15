// Схема для сохранения в БД руководителя с его сотрудниками
import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  birthday: {
    type: String,
    required: true,
  },
});

const managerSchema = new mongoose.Schema({
  rukovoditel: { type: String, required: true },
  sotrudniki: [employeeSchema],
});

export const ManagerModel = mongoose.model('Manager', managerSchema);
