export const tableConfig = {
  workshops: {
    columns: ['workshopId', 'name', 'address'],
    displayNames: {
      workshopId: 'ID',
      name: 'Название',
      address: 'Адрес',
    },
    dataTypes: {
      workshopId: 'number',
      name: 'string',
      address: 'string',
    },
  },

  teams: {
    columns: ['teamId', 'name'],
    displayNames: {
      teamId: 'ID',
      name: 'Название',
    },
    dataTypes: {
      teamId: 'number',
      name: 'string',
    },
  },
  staff: {
    columns: [
      'personInn',
      'workshopId',
      'teamId',
      'fullName',
      'position',
      'salary',
      'hireDate',
    ],
    displayNames: {
      personInn: 'ИНН',
      workshopId: 'ID Мастерской',
      teamId: 'ID Бригады',
      fullName: 'ФИО',
      position: 'Должность',
      salary: 'Зарплата',
      hireDate: 'Дата найма',
    },
    dataTypes: {
      personInn: 'string',
      workshopId: 'number',
      teamId: 'number',
      fullName: 'string',
      position: 'string',
      salary: 'number',
      hireDate: 'date',
    },
  },
  cars: {
    columns: ['carId', 'bodyNumber', 'engineNumber', 'owner', 'factoryNumber'],
    displayNames: {
      carId: 'ID',
      bodyNumber: 'Номер кузова',
      engineNumber: 'Номер двигателя',
      owner: 'Владелец',
      factoryNumber: 'Заводской номер',
    },
    dataTypes: {
      carId: 'number',
      bodyNumber: 'string',
      engineNumber: 'string',
      owner: 'string',
      factoryNumber: 'string',
    },
  },
  carModels: {
    columns: ['modelId', 'brand', 'model'],
    displayNames: {
      modelId: 'ID',
      brand: 'Марка',
      model: 'Модель',
    },
    dataTypes: {
      modelId: 'number',
      brand: 'string',
      model: 'string',
    },
  },
  malfunctions: {
    columns: ['malfunctionId', 'name', 'laborCost'],
    displayNames: {
      malfunctionId: 'ID',
      name: 'Название',
      laborCost: 'Стоимость работы',
    },
    dataTypes: {
      malfunctionId: 'number',
      name: 'string',
      laborCost: 'number',
    },
  },
  carRepairs: {
    columns: [
      'repairId',
      'carId',
      'malfunctionId',
      'startDate',
      'endDate',
      'teamId',
    ],
    displayNames: {
      repairId: 'ID Ремонта',
      carId: 'ID Автомобиля',
      malfunctionId: 'ID Неисправности',
      startDate: 'Дата начала',
      endDate: 'Дата окончания',
      teamId: 'ID Бригады',
    },
    dataTypes: {
      repairId: 'number',
      carId: 'number',
      malfunctionId: 'number',
      startDate: 'date',
      endDate: 'date',
      teamId: 'number',
    },
  },
  spareParts: {
    columns: [
      'partId',
      'modelId',
      'malfunctionId',
      'name',
      'price',
      'quantity',
    ],
    displayNames: {
      partId: 'ID Запчасти',
      modelId: 'ID Модели',
      malfunctionId: 'ID Неисправности',
      name: 'Название',
      price: 'Цена',
      quantity: 'Количество',
    },
    dataTypes: {
      partId: 'number',
      modelId: 'number',
      malfunctionId: 'number',
      name: 'string',
      price: 'number',
      quantity: 'number',
    },
  },
}
