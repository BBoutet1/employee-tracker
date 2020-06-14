//npm modules
let mysql = require("mysql");
let inquirer = require("inquirer");
let consoleTable = require("console.table");

let connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // squl user name
    user: "root",

    //sql passeword
    password: "",
    database: "employeesDB"
});

//Connection to sql database
connection.connect(function(err) {
    if (err) throw err;
    //Calling the inquirers functions
    manageEmployees();
});

// Answers to the first inquirer question
actionToDo = ["View all employees", "View all employees by department",
    "View all employees by manager", "Add employee", "Remove employee",
    "Update employee role", "Update employee Manager", "Add role", "Add department", "Exit prompt",
];

//Global functions to start prompts questions
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
                    //Display all employees
                    viewAllEmployees();
                    break;

                case actionToDo[1]:
                    //Display employees by department
                    viewEmployeesBy("department", function(res) {
                        const departmentsList = [];
                        res.forEach(department => departmentsList.push(`${department.id}  ${department.name}`))
                            //Calling the function to select the department and display employees
                        employeesByDepartment(departmentsList)
                    });
                    break;

                case actionToDo[2]:
                    //Display employees by manager
                    viewEmployeesBy("manager", function(res) {
                        let managerIDs = []; // manager ID for each employee
                        res.forEach(employee => managerIDs.push(employee.manager_id));
                        // managerIDs = Array.from(new Set(managerIDs)); // removing duplicates IDs
                        managerIDs.sort(function(a, b) { //sorting the manager IDs
                            return a - b;
                        });
                        console.log("managers id" + managerIDs);
                        //Calling the function to select the manager and display employees
                        employeesByManager(managerIDs)
                    });
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
                case actionToDo[7]:
                    connection.end();
                    return
            }
        });

    //This function query and print all employees data
    function viewAllEmployees() {
        let query = "";
        //Preparing the query
        query = mainQuery(query)
        connection.query(query, function(err, res) {
            if (err) throw err;
            //Maing and processing the the query response
            processResult(res)
        });
    }

    function employeesByDepartment(departmentsList) {;
        inquirer
            .prompt({
                message: "Which department team would do like to see?",
                name: "department",
                type: "list",
                choices: departmentsList
            })
            .then(function(answer) {
                let query = "";
                let departmentId = 1;
                //Preparing the query
                query = mainQuery(query);
                //Filtering the departmen
                departmentId += departmentsList.indexOf(answer.department);
                query += ` WHERE department.id = ${departmentId}`
                connection.query(query, function(err, res) {
                    if (err) throw err;
                    //Maing and processing the the query response
                    processResult(res)
                });
            });
    }

    function employeesByManager(managersList) {;
        inquirer
            .prompt({
                message: "Which manager team would do like to see?",
                name: "department",
                type: "list",
                choices: managersList
            })
            .then(function(answer) {
                let query = "SELECT employee.id, employee.first_name, employee.last_name ";
                query += "FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (role.department_id = department.id) ";
                query += "WHERE department.name = ?";
                connection.query(query, answer.department, function(err, res) {
                    if (err) throw err;
                    console.log(res.length + " matches found!");
                    console.log(res);
                });
            });
    }
    //This function prepare and return the sql database query for all employees data
    function mainQuery(query) {
        query = "SELECT employee.*, role.title AS role, department.name AS department, role.salary FROM employee ";
        query += "INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (role.department_id = department.id) ";
        return query;
    }

    //This function make the sql database query and process the response
    function processResult(res) {
        const employees = res;
        //For each employee, loop to find the manager (the one the manager id belong to)
        res.forEach(element => {
            employees.forEach(elmt => {
                if (element.manager_id === elmt.id) {
                    //Manager found
                    element.manager = `${elmt.first_name} ${elmt.last_name}`;
                    delete element.manager_id; // no more needed when manager found
                    delete element.role_id;
                }
            })
        });

        //This function print employees data
        setTimeout(function printEmployeesData() {
            console.log("------------------------------------------------------------------------------")
            console.table(res);
            manageEmployees();
        }, 500)

    }

    //This function prepare and return the inquirer list of choices for employees selection by department or manager
    function viewEmployeesBy(param, getTable) {
        //Database query
        let query = ""
        if (param === "department") {
            //Getting all deparment names
            query = "SELECT * FROM department ORDER BY department.id";
        } else if (param === "manager") {
            //Getting all employees manager ids (duplicates to be removed later)
            query = "SELECT DISTINCT employee.manager_id FROM employee";
        }
        connection.query(query, function(err, res) {
            if (err) throw err;
            console.log("by department" + JSON.stringify(res))
            return getTable(res)
        });
    }

}