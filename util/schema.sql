DROP TABLE if exists vehicles;
DROP TABLE if exists customers;
DROP TABLE if exists users;
DROP TABLE if exists agreements;

CREATE TABLE vehicles (
  stock_number text PRIMARY KEY,
  year int NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  color text NOT NULL,
  vin text NOT NULL,
  mileage text NOT NULL,
  status text NOT NULL
);

CREATE TABLE customers (
  id serial PRIMARY KEY,
  f_name text NOT NULL,
  l_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip_code int NOT NULL,
  birthday date NOT NULL,
  license_num text NOT NULL,
  license_exp date NOT NULL,
  ins_name text NOT NULL,
  ins_policy text NOT NULL,
  ins_exp date NOT NULL
);

CREATE TABLE users (
  userID BIGSERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  password VARCHAR(200) NOT NULL,
  UNIQUE (email)
);

CREATE TABLE agreements (
  agreement_num serial PRIMARY KEY, 
  cust_id int NOT NULL, 
  stock_number text NOT NULL, 
  date_out DATE NOT NULL,
  date_in DATE, 
  mileage_out int NOT NULL, 
  mileage_in int,

  CONSTRAINT fk_cust_id FOREIGN KEY(cust_id) REFERENCES customers(id),
  CONSTRAINT fk_stock_number FOREIGN KEY(stock_number) REFERENCES vehicles(stock_number)
);

INSERT INTO vehicles VALUES
  ('B7616',2017,'Ford','Escape','Silver','1FMCU9J92HUB30798',79588,'Available');
INSERT INTO vehicles VALUES
  ('B7690',2018,'Toyota','Sienna','Silver','5TDKZ3DC1JS926782',34337,'Available');
INSERT INTO vehicles VALUES
  ('B7693',2017,'Subaru','Forester','Red','JF2SJARC3HH485189',29590,'Available');
INSERT INTO vehicles VALUES
  ('B7710',2019,'Toyota','Highlander','Grey','5TDJZRFH8KS704605',40505,'Available');
INSERT INTO vehicles VALUES
  ('B7719',2020,'Toyota','Highlander','Grey','5TDGZRBH3LS012835',71978,'Available');
INSERT INTO vehicles VALUES
  ('B7720',2020,'Toyota','Highlander','Grey','5TDGZRBH5LS016952',62317,'Available');
INSERT INTO vehicles VALUES
  ('B7729',2019,'Toyota','Highlander','Black','5TDJZRFH1KS580063',68415,'Available');
INSERT INTO vehicles VALUES
  ('B7744',2018,'Toyota','Highlander','Brown','5TDDZRFH2JS496779',49008,'Available');
INSERT INTO vehicles VALUES
  ('B7766',2020,'Toyota','Highlander','Silver','5TDGZRBH1LS000683',64080,'Loaned Out');
INSERT INTO vehicles VALUES
  ('B7885',2020,'Toyota','Highlander','Black','5TDGZRBH7LS507541',63010,'Loaned Out');
INSERT INTO vehicles VALUES
  ('B7966',2020,'Toyota','Corolla','Silver','5YFEPRAE6LP031702',58240,'Repairing');
INSERT INTO vehicles VALUES
  ('B8021',2020,'Toyota','Camry','Blue','4T1G11AKXLU326737',68017,'Repairing');
INSERT INTO vehicles VALUES
  ('B8166',2018,'Toyota','Highlander','Blue','5TDJZRFH8JS830851',96339,'Repairing');
INSERT INTO vehicles VALUES
  ('TV1332A',2017,'Toyota','4Runner','Red','JTEBU5JR5H5424257',86276,'Decommissioned');


INSERT INTO customers (f_name, l_name, phone, address, city, state, zip_code,
  birthday, license_num, license_exp, ins_name, ins_policy, ins_exp)
  VALUES ('Matt','Wudi','(715)-967-7707','818 Main St','Eau Claire','WI','54701',
  '1995-08-12','W300-5569-5292-02','2030-08-12','State Farm','363 5274-A06-49','2023-01-06'),
  ('Tyler','Grant','(715)-543-9900', '398 Trippy Ln', 'Chippewa Falls', 'WI','54729',
  '1991-12-12','P488-9932-4542-03','2029-12-12','State Farm','567 2139-E84-27','2023-03-14');

INSERT INTO customers (f_name, l_name, phone, address, city, state, zip_code,
  birthday, license_num, license_exp, ins_name, ins_policy, ins_exp)
  VALUES ('Connor','MacNicol','(715)-944-7377','123 Main St','Eau Claire','WI','54701',
  '1997-05-30','M200-5569-5292-02','2027-08-12','State Farm','361 5276-M06-49','2023-01-09');

INSERT INTO agreements (cust_id, stock_number, date_out, date_in, mileage_out, mileage_in)
VALUES ('1','B8166','2022-11-25','2022-11-26', 86276, 86303);

INSERT INTO agreements (cust_id, stock_number, date_out, date_in, mileage_out, mileage_in)
VALUES ('1','B8021','2022-11-11','2022-11-13', 68017, 68028);

INSERT INTO agreements (cust_id, stock_number, date_out, date_in, mileage_out, mileage_in)
VALUES ('2','B8166','2022-10-09','2022-11-05', 80111, 86275);

INSERT INTO agreements (cust_id, stock_number, date_out, date_in, mileage_out, mileage_in)
VALUES ('2','B8021','2022-09-09','2022-11-10', 66785, 68016);

INSERT INTO agreements (cust_id, stock_number, date_out, date_in, mileage_out, mileage_in)
VALUES ('2','B7966','2022-08-17','2022-08-26', 58111, 58239);

INSERT INTO agreements (agreement_num, cust_id, stock_number, date_out, date_in, mileage_out, mileage_in)
VALUES
  (1,1,'B7720','2022-11-22',null,62317,null),
  (2,2,'B7885','2022-11-27',null,63010,null);

SELECT * FROM vehicles;
SELECT * FROM customers;
SELECT * FROM users;
SELECT * FROM agreements;