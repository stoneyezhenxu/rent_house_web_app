## 1、Backend Server

**Supports APIs for the project of "Rent House Web App" based on nodejs**

## 2、How to prepare the datas

 Create the dababase based on **Mysql** using the tools of **Navicat Premium**

#### 2.1 First, create the dababase and import the datas

​	 a) In the database, create a new database with the name 'hkzk'

 	b) choose the character encoding format as UTF-8.
 	
 	c) Then, import the corresponding SQL file.

 Note that, the path of SQL file is

```shell
/db/hkzf_db.sql
```

## 3、How to run the server

#### 3.1 Install the dependencies

```shell
cd ./server/server_backend/
npm install
yarn
```



#### 3.2 Modify the config to connecte your mysql database.

```shell
Modify the config of mysql
./server/server_backend/config/mysql.js

dialect: 'mysql',
host: 'localhost', // host ip
user: 'root',      // username
pass: '11112222',  // password
port: 3306,        // port
database: 'hkzf',  // database name
```

It shoud be show in the console:

 		Database connection successful！

if failed,

 		Database connection exception,please check the config of '/server_backend/config/mysql.js'

#### 3.3 Start the server

```shell
yarn start
```

#### 3.4 API documentations .

the API documentations is created based on **wagger-ui**

Open th website, and type the url :

​		 http://localhost:8009/

Note that: the port "8009" you can modify from the file of the line 15 , whcih path is 'bin/www'

## 4、Try to call the APIs endpoint

 You can either use the Postman call the APIs endpoint or call the APIs from the front-end like axios.
