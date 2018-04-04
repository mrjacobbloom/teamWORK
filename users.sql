drop database if exists naturalneighbors;
create database naturalneighbors;
use naturalneighbors;
drop table if exists users;
create table users (
    username varchar(30),
    email varchar(50),
    password varchar(20),
    state varchar(2),
    zipcode int,
    primary key (username)
);

insert into users values ('robert','robert.rossetti@colorado.edu','1234','CO',80302);
insert into users values ('john','john.doe@gmail.com','johndoe','AK',12345);
insert into users values ('jane','jane.doe@colorado.edu','password','CO',80302);
insert into users values ('Ursa','ursa.major@space.com','stars','ME',99999);
insert into users values ('Ulfric','ulfrik.stormcloak@winterhold.edu','nords','AK',90210);
