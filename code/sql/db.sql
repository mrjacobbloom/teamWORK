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




drop table if exists data;
create table data (
    username varchar(30),
    post_title varchar(50),
	post_desc varchar(250),
	latitude float,
	longitude float,
	post_date datetime #YYYY-MM-DD HH:MI:SS format
    
);

insert into data values ('robert','squirrel','the squirrel was in my yard',40.0340975,-105.27215699999,'2018-04-04 12:00:00');
insert into data values ('robert','another squirrel','This cheeky squirrel was in a tree.',40.0340975,-105.27215699999,'2018-04-05 12:00:00');
insert into data values ('john','buffalo near I-95','the buffalo was standing by the highway',41.0340975,-107.27215699999,'2018-04-04 12:00:00');
insert into data values ('jane','spider in my shower!','Went to take a shower and found a spider hanging out in my shower.',40.0340975,-105.27215699999,'2018-04-01 12:00:00');
insert into data values ('jane','marmot in my sink!','Went to wash my hands and spotted a marmot in my sink.',40.0340975,-105.27215699999,'2018-04-01 12:00:00');
insert into data values ('Ulfric','deer in the road','Driving to whiterun and a deer crossed my path in the road.',42.000,-2.27215699999,'2018-01-01 12:00:00');
