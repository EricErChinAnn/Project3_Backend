To start mysql, in the terminal, type in `mysql -u root`

# Create a new database user
In the MySQL CLI:
```
CREATE USER 'admin'@'%' IDENTIFIED WITH mysql_native_password BY 'asd123';
```

```
grant all privileges on *.* to 'admin'@'%';
```

```
FLUSH PRIVILEGES;
```


# Dependencies
* db-migrate
* db-migrate-mysql
* mysql
* express
* hbs
* wax-on (inheritance)
* .env
* nodemon
* 