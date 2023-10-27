# Rent House Web App



## 1. Introduction

The "Rent House (Web Mobile Web)" project is a mobile web application based on React. 

It is designed with modular, component-based, and engineering principles to provide functionality similar to apps like Beike.

The project addresses the user's need to find housing resources.



## 2. Technology Stack

`react 17`                                  :    JSX + hook

`react-router v6`                   :   Router

 `antd-mobile v5`                    :   UI components

`react-virtualized`               :   Long List

`create-react-app`                 :  Scaffold

`axios`  									  :  Call APIs

`formik+Yup`   						  :  Login & Register Form 

`Baidu Map API` 					 :  Map & Location



## 3. Functionals

The main functional modules of the "Rent House Web App" platform are as follows:

1. **Search for Housing:**
   - Utilize Baidu Maps to search for available housing.
   - Filter housing options based on criteria like current city, transportation, rent, housing facilities, etc.
2. **City Switching:**
   - Incorporate a city selection module for users to switch between cities.
   - Implement a feature for auto-locating the user's current city.
   - Offer different housing options in various cities.
3. **Login Module:**
   - Provide functionality for user registration and login.
   - Allow users to view and modify their personal information.
   - After logging in, users can save housing listings in their favorites and view details in the "My" section.
4. **Housing Details:**
   - Display comprehensive information about each housing listing, including rent, size, amenities, location, property description, features, and contact information.
   - Enable users to add listings to their favorites (requires login) and make phone appointments.
5. **Housing Listing Submission:**
   - Implement a feature for users to publish housing listings.
   - Users can upload relevant information about their properties.
   - Provide a page for users to view their published listings (requires login).
6. **History Records:**
   - Offer a module that allows users to view their browsing history.



## 4. Screenshots Page

####  4.1 Home Page

<img src="public/screenshots/1.png" alt="首页" width="200px" />



#### 4.2 Search Page

<img src="public/screenshots/2.png" alt="找房" width="200px" />

#### 4.3 News Page

<img src="public/screenshots/3.png" alt="咨询" width="200px" />

#### 4.4 Profile Page

<img src="public/screenshots/4.png" alt="我的" width="200px" />

#### 4.5 City List Page

<img src="public/screenshots/5.png" alt="城市列表" width="200px" />



#### 4.6 Map Search Page 

<img src="public/screenshots/6.png" alt="地图找房" width="200px" />

#### 4.7 Map Details Page 

<img src="public/screenshots/7.png" alt="地图房源列表" width="200px" />

#### 4.8 Room Descript Page

<img src="public/screenshots/8.png" alt="房源详情1" width="200px" />

#### 4.9 Room Details Page

<img src="public/screenshots/9.png" alt="房源详情2" width="200px" />

#### 4.10 My Favorites None Page 

<img src="public/screenshots/10.png" alt="无收藏" width="200px" />

#### 4.11 My Favorites  Page 

<img src="public/screenshots/11.png" alt="有收藏" width="200px" />

#### 4.12 My Rent Page

<img src="public/screenshots/12.png" alt="无出租" width="200px" />

#### 4.13 Post House Page

<img src="public/screenshots/14.png" alt="添加出租" width="200px" />

#### 4.14 Post House Detail Page

<img src="public/screenshots/16.png" alt="添加房源详情1" width="200px" />



## 5. How to run

#### 5.1 Firstly,  run the server 

Follow the instructions of the  backend server's README.md 

```
server/server_backend/README.md
```

#### 5.2 Then start the application

```shell
cd /
yarn install  #install the denpendencies
yarn start    # start the app 
```



## 6. Others 

If you have any specific questions or need help with anything related to React development or this project, feel free to ask, my email is stoneyezhenxu@gmail.com
