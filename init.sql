-- users table
create table users (userid serial primary key, name varchar(50), email varchar(50), password text);

-- products table
create table products (productid serial primary key, productname varchar(50), productcost integer, productdescription text, productimage text, productquantity integer);

-- carts table
create table carts (cartid serial primary key, byuser integer, productid integer);

-- forum table
create table forum (postid serial primary key, byuser integer, posttitle varchar(50), postcontent text, date timestamptz default current_timestamp);

-- comments table
create table comments (commentid serial primary key, postid integer, byuser integer, comment text, date timestamptz default current_timestamp);
