# FinstarTask

### Стек
- ASP.Net Core 8
- MS SQL
- Entity Framework
- Node v18.14.2 +
- React TS
- Antd

### 1. Подготовка
##### 1.1 Настройка подключения к БД
- Откройте файл <strong>FinstarTask.Server\Program.cs</strong>
- Найдите строку подключения к БД и исправьте ее в случае необходимости
![alt text](image-0.png)
Используемая учетная запись должна иметь права DDL\DML\create database

##### 1.2 Убедитесь, что у Вас установлен Node версии 18.14.2+
``` bash
  node --version
```
> работоспособность с другими версиями не проверялась

### 2. Запуск
- В Visual Studio выбирете проект по умлочанию

![alt text](image.png)
- В параметрах запуска выберите <strong>http</strong>

![alt text](image-1.png)
- Нажмите <strong>F5</strong>

![alt text](image-5.png)
