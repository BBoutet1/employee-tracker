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
                    employeesbyDepatment();
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




    function viewEmployees() {
        connection.query("SELECT * FROM employee", function(err, res) {
            if (err) throw err;
            console.log(res);
            connection.end();
        });
    }

    function employeesbyDepatment() {

        inquirer
            .prompt({
                name: "department",
                type: "input",
                message: "Which department employee would do like to see?"
            })
            .then(function(answer) {
                var query = "SELECT employee.first_name, employee.last_name ";
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