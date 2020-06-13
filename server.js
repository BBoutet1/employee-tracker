var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "employeesDB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    manageEmployees();
});

// Global variable;
let departmentsList = [];
let managersList = [];
let rolesList = [];

// Answers to the first inquirer question
actionToDo = ["View all employees", "View all employees by department",
    "View all employees by manager", "Add employee", "Remove employee",
    "Update employee role", "Update employee Manager", "Add role", "Add department",
];


function manageEmployees() {
    inquirer
        .prompt([{
            message: "What would you like to do?",
            name: "action",
            type: "list",
            choices: actionToDo,
        }])
        .then(function(answer) {
            switch (answer.action) {
                case actionToDo[0]:
                    viewEmployees();
                    break;

                case actionToDo[1]:
                    viewEmployeesBy("department", function(res) {
                        res.forEach(department => departmentsList.push(department.name));
                        employeesByDepatment(departmentsList)
                    });
                    break;

                case actionToDo[2]:
                    employeesbyManager();
                    break;

                case actionToDo[3]:
                    addEmployee();
                    break;
                case actionToDo[4]:
                    removeEmployee();
                    break;

                case actionToDo[5]:
                    updateRole();
                    break;
                case actionToDo[6]:
                    updateRole();
                    break;
                case actionToDo[6]:
                    addRole();
                    break;
                case actionToDo[6]:
                    addDepartment();
                    break;
            }

        });
    //A function to return an array listing departments, managers or roles
    function viewEmployeesBy(param, getTable) {
        //Database query to get all departments names
        connection.query("SELECT * FROM " + param, function(err, res) {
            if (err) throw err;
            // deparmentsList = res;
            return getTable(res)
        });
    }

    function viewEmployees() {
        connection.query("SELECT * FROM employee", function(err, res) {
            if (err) throw err;
            console.log(res);
            connection.end();
        });
    }

    function employeesByDepatment(departmentsList) {;
        inquirer
            .prompt({
                message: "Which department employee would do like to see?",
                name: "department",
                type: "list",
                choices: departmentsList
            })
            .then(function(answer) {
                let query = "SELECT employee.first_name, employee.last_name ";
                query += "FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (role.department_id = department.id) ";
                query += "WHERE department.name = ?";
                connection.query(query, answer.department, function(err, res) {
                    if (err) throw err;
                    console.log(res.length + " matches found!");
                    console.log(res);
                    connection.end();
                });
            });
    }

}