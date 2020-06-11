DROP DATABASE IF EXISTS employeesDB;
CREATE database employeesDB;

USE employeesDB;

CREATE TABLE employee (
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INT NOT NULL,
  manager_id INT NOT NULL,
  PRIMARY KEY (role_id),
);

CREATE TABLE role (
  title VARCHAR(30) NULL,
  salary DECIMAL NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (department_id)
);

CREATE TABLE department (
  name VARCHAR(30) NULL
);