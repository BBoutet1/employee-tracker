DROP DATABASE IF EXISTS employeesDB;
CREATE database employeesDB;

USE employeesDB;

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
   id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NULL,
  department_id INT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE department (
   id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', '1', '5');
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Paulo', 'Mendes', '3', '1');
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Franck', 'Olu', '2', '1');
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Marie', 'Jeanne', '4', '5');
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Marc', 'Dumas', '6', NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Pal', 'Ghandi', '5', '4');
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Wu', 'Deng', '7', NULL);

 INSERT INTO role (title, salary, department_id) VALUES ('Operation Manager', '80000', '2');
 INSERT INTO role (title, salary, department_id) VALUES ('ASSEMBLER', '40000', '2');
 INSERT INTO role (title, salary, department_id) VALUES ('MACHINIST', '45000', '2');  
 INSERT INTO role (title, salary, department_id) VALUES ('HR Manager', '70000', '1');  
 INSERT INTO role (title, salary, department_id) VALUES ('RECEPTIONIST', '30000', '1');  
 INSERT INTO role (title, salary, department_id) VALUES ('CEO', '100000', '6');  
 INSERT INTO role (title, salary, department_id) VALUES ('Quality Engineer', '65000', '3');      

 INSERT INTO department (name) VALUES ('HR'); 
 INSERT INTO department (name) VALUES ('PROD');
 INSERT INTO department (name) VALUES ('QUALITY');
 INSERT INTO department (name) VALUES ('SALES');
 INSERT INTO department (name) VALUES ('SHIPPING');
 INSERT INTO department (name) VALUES ('DIRECTION')
         