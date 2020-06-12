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
// Answers to the first inquirer question
whatToDo = ["View all employees", "View all employees by department",
    "View all employees by manager", "Add employee", "Remove employee",
    "Update employee role", "Update employee Manager", "Add role", "Add department",
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
            if (answer.doWhat === whatToDo[0]) {
                viewEmployees();
            } else if (answer.doWhat === whatToDo[1]) {
                EmployeesbyDepatment();
            } else if (answer.doWhat === whatToDo[2]) {
                EmployeesbyManager();
            } else if (answer.doWhat === whatToDo[3]) {
                addEmployee();
            } else if (answer.doWhat === whatToDo[4]) {
                removeEmployee();
            } else if (answer.doWhat === whatToDo[5]) {
                updateRole();
            } else if (answer.doWhat === whatToDo[6]) {
                updateManager();
            } else if (answer.doWhat === whatToDo[7]) {
                addRole();
            } else if (answer.doWhat === whatToDo[6]) {
                addDepartment();
            }

        });

    function viewEmployees() {
        connection.query("SELECT * FROM employee", function(err, res) {
            if (err) throw err;
            console.log(res);
            connection.end();
        });
    }


}