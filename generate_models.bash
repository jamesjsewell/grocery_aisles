sequelize model:generate --name user \
 --attributes fname:string,lname:string,email:string

sequelize model:generate --name store \
 --attributes name:string

sequelize model:generate --name aisle \
 --attributes name:string,store_id:integer

sequelize model:generate --name product \
 --attributes name:string,quantity:integer,price:float,aisle_id:integer

sequelize model:generate --name list \
 --attributes store_id:integer,product_id:integer,aisle_id:integer,user_id:integer 
