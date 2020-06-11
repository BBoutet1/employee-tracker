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
    manageEmployees();
});
// Answers to the first inquirer question
whatToDo = ["View all employees", "View all employees by department",
    "View all employees by manager", "Add employee", "Remove employee",
    "Update employee role", "Update employee Manager"
];

function manageEmployees() {
    inquirer
        .prompt([{
            message: "What would you like to do?",
            name: "doWhat",
            type: "list",
            choices: whatToDo,
        }])
        .then(function(answer) {

        });
    console.log("App listening on PORT");
}