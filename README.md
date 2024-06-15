## Инструкция по запуску бекенда

Использовалась Ubuntu 22.04.4 LTS

### 1. Скачать этот репозиторий

    git clone https://github.com/Range18/atomic-Hack2.0.git

### 2. Прописать переменные окружения в .env

- Переименовать .env.example в .env
- Следовать комментариям в .env

### 3. Установка Nginx

Устаноку reverse-proxy можно произвести по гайду ниже:
https://nginx.org/ru/linux_packages.html#Ubuntu

### 4. Настройка Nginx

Создать в директории /путь до nginx/nginx/conf.d файл _домен_.conf

В этот файл вставить конфиг, который находится по этой ссылке:
https://github.com/Range18/atomic-Hack2.0/blob/main/example.com.conf

При этом надо изменить:

- _example.com_  на название используемого домена

### 5. Установка SSL сертификатов

```bash
# Установка certbot
$ sudo apt install certbot python3-certbot-nginx

# Проверка конфигов
$ sudo nginx -t

# Перезапуск
$ sudo systemctl reload nginx

# Донастройка Nginx
$ sudo ufw status

$ sudo ufw allow 'Nginx Full'
$ sudo ufw delete allow 'Nginx HTTP'

# Вместо example.com - имя вашего домена
$ sudo certbot --nginx -d example.com -d www.example.com

# Перезапуск
$ sudo systemctl reload nginx
```

### 6. Установка MySQL

https://selectel.ru/blog/ubuntu-mysql-install/

### 7. Установка Node.js

```bash
$ sudo apt install nodejs
$ sudo apt install npm
```

### 8. Установка зависимостей

```bash
$ npm install
```

### 9. Запуск

```bash
# для запуска в продакшн
$ npm run start:prod

# для отладки
$ npm run start

# для отладки с автоматическим перезапуском
$ npm run start:dev
```
