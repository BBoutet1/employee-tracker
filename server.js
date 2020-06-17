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
    "View all employees by manager", "Add a new employee", "Remove employee",
    "Update employee role", "Update employee Manager", "Add role", "Add department", "Exit prompt",
];

//Global functions to start prompts questions
function manageEmployees() {
    console.log("====================================")
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
                    viewAllEmployees(true);
                    break;

                case actionToDo[1]:
                    //Display employees by department
                    viewEmployeesBy("department", function(res) {
                        const departmentsList = [];
                        res.forEach(department => departmentsList.push(`${department.id}  ${department.name}`));
                        //Calling the function to select the department and display employees
                        employeesByDepartment(departmentsList)
                    });
                    break;

                case actionToDo[2]:
                    //Display employees by manager
                    viewEmployeesBy("manager", function(res) {
                        let managerIDs = []; // manager ID for each employee
                        let query = "";
                        res.forEach(employee => { managerIDs.push(employee.manager_id) });
                        query = "SELECT * FROM employee ORDER BY employee.id"
                        connection.query(query, function(err, resp) {
                            if (err) throw err;
                            const managersList = [];
                            resp.forEach(employee => {
                                managerIDs.forEach(id => {
                                    if (employee.id == id) {
                                        managersList.push(`${employee.id} ${employee.first_name} ${employee.last_name}`)
                                    }
                                })
                            });
                            //Calling the function to select the manager and display employees
                            employeesByManager(managersList)
                        });
                    });
                    break;
                case actionToDo[3]:
                    //Add a new employee
                    employeeRoles(function(res) {
                        const rolesList = [];
                        const employeesList = [];
                        res.forEach(role => rolesList.push(`${role.id} ${role.title}`));
                        viewAllEmployees(function(res) {
                            res.forEach(employee => employeesList.push(`${employee.id}  ${employee.first_name} ${employee.last_name}`));
                            //Calling the function to add an employee
                            addEmployee(rolesList, employeesList)
                        });
                    });
                    break;
                case actionToDo[4]:
                    //Delete an employee
                    viewAllEmployees(function(res) {
                        const employeesList = [];
                        res.forEach(employee => employeesList.push(`${employee.id}  ${employee.first_name} ${employee.last_name}`));
                        //Calling the function to add an employee
                        removeEmployee(employeesList);
                    });
                    break;
                case actionToDo[5]:
                    //Update employee role
                    employeeRoles(function(res) {
                        const rolesList = [];
                        const employeesList = [];
                        res.forEach(role => rolesList.push(`${role.id} ${role.title}`));
                        viewAllEmployees(function(res) {
                            res.forEach(employee => employeesList.push(`${employee.id}  ${employee.first_name} ${employee.last_name}`));
                            //Calling the function to add an employee
                            updateRole(rolesList, employeesList)
                        });
                    });
                    break;
                case actionToDo[6]:
                    //Update employee manager
                    viewAllEmployees(function(res) {
                        const employeesList = [];
                        res.forEach(employee => employeesList.push(`${employee.id} ${employee.first_name} ${employee.last_name}`));
                        //Calling the function to add an employee
                        updateManager(employeesList)
                    });
                    break;
                case actionToDo[7]:
                    viewEmployeesBy("department", function(res) {
                        const departmentsList = [];
                        res.forEach(department => departmentsList.push(`${department.id}  ${department.name}`));
                        //Calling the function to select the department and display employees
                        addRole(departmentsList)
                    });
                    break;
                case actionToDo[8]:
                    addDepartment();
                    break;
                case actionToDo[7]:
                    connection.end();
                    return
            }
        });

    //This function query and print all employees data
    function viewAllEmployees(process) {
        let query = "";
        //Preparing the query
        query = employeesQuery(query)
        connection.query(query, function(err, res) {
            if (err) throw err;
            if (process == true) {
                processResult(res)
            }
            if (process != true) {
                //The return is used when adding a new employee to select a manager among all all employees
                return process(res)
            }
        });
    }

    //This function allows the user to select a department and then view employees working in this department
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
                query = employeesQuery(query);
                //Filtering the department team
                departmentId += departmentsList.indexOf(answer.department);
                query += ` WHERE department.id = ${departmentId}`
                connection.query(query, function(err, res) {
                    if (err) throw err;
                    //Processing the the query response
                    processResult(res)
                });
            });
    }

    //This function allows the user to select a manager and then view employees in his/her teem.
    function employeesByManager(managersList) {;
        inquirer
            .prompt({
                message: "Which manager team would do like to see?",
                name: "manager",
                type: "list",
                choices: managersList
            })
            .then(function(answer) {
                let query = "";
                //Getting the manager employee id
                let managerId = answer.manager.split(" ")[0];
                //Query for all employees
                query = employeesQuery(query);
                //Adding the manager id filter in the query
                query += ` WHERE employee.manager_id = ${managerId}`
                connection.query(query, function(err, res) {
                    if (err) throw err;
                    //Processing the query response
                    res.forEach(employee => {
                        //Manager known
                        employee.manager = `${answer.manager.split(" ")[1]} ${answer.manager.split(" ")[2]}`;
                    })
                    processResult(res)
                });
            });
    }

    //This function allow the user to add an employee and assign role and manager
    function addEmployee(rolesList, employeesList) {;
        inquirer
            .prompt([{
                name: "first_name",
                type: "input",
                message: "Enter the employee first name:"
            }, {
                name: "last_name",
                type: "input",
                message: "Enter the employee last name:"
            }, {
                message: "Choose the employee role:",
                name: "role",
                type: "list",
                choices: rolesList
            }, {
                message: "Would you like to assign a manager to the employee?",
                name: "assign",
                type: "confirm"
            }])
            .then(async function(answer) {
                const role_id = answer.role.split(" ")[0];

                function getManager() {
                    return inquirer
                        .prompt({
                            message: "Assign a manager to the new employee:",
                            name: "manager",
                            type: "list",
                            choices: employeesList
                        })
                }
                if (answer.assign) {
                    const selectedManager = await getManager();
                    const assignedManager = selectedManager.manager;
                    answer.manager_id = assignedManager.split(" ")[0];
                } else {
                    answer.manager_id = null;
                }
                console.log("assigned Role" + answer.role);
                const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answer.first_name}', '${answer.last_name}', '${role_id}','${answer.manager_id}')`;
                connection.query(query, function(err, res) {
                    if (err) throw err;
                    //Processing the query response
                    console.log("-------------------------")
                    console.log(`Added employee: ${answer.first_name} ${answer.first_name} added. Position: ${answer.role.split(" ")[1]}`);
                    manageEmployees();
                })
            });
    }

    //This function prompts the list of employee to remove the one the user  selects
    function removeEmployee(employeesList) {;
        inquirer
            .prompt({
                message: "Select the employee you would like to remove:",
                name: "employee",
                type: "list",
                choices: employeesList
            })
            .then(async function(answer) {
                const employee_id = answer.employee.split(" ")[0];
                const selectedEmploye = answer.employee;
                const query = `DELETE FROM employee WHERE id = '${employee_id}'`;
                connection.query(query, function(err, res) {
                    if (err) throw err;
                    //Processing the query response
                    console.log("-------------------------")
                    console.log(`Removed employee: ${selectedEmploye}`);
                    manageEmployees();
                })
            });
    }

    //This function allow the user to update the employee role
    function updateRole(rolesList, employeesList) {
        inquirer
            .prompt({
                message: "Select the employee you would like to update his role:",
                name: "employee",
                type: "list",
                choices: employeesList
            })
            .then(async function(answer) {
                const employee = answer.employee;
                const employeeID = employee.split(" ")[0];;

                function getRole() {
                    return inquirer
                        .prompt({
                            message: "Select the employee new role:",
                            name: "role",
                            type: "list",
                            choices: rolesList
                        })
                }
                const selectedRole = await getRole();
                const assignedRole = selectedRole.role;
                answer.role_id = assignedRole.split(" ")[0];
                const query = `UPDATE employee SET role_id = '${answer.role_id}' WHERE id ='${employeeID}'`;
                connection.query(query, function(err, res) {
                    if (err) throw err;
                    //Processing the query response
                    console.log("-------------------------")
                    console.log(`Update role for employee ${employee}. New position: ${assignedRole}`);
                    manageEmployees();
                })
            });
    }

    //This function allows the user to update the employee manager
    function updateManager(employeesList) {;
        inquirer
            .prompt({
                message: "Select the employee you would like to update his role:",
                name: "employee",
                type: "list",
                choices: employeesList
            })
            .then(async function(answer) {
                const employee = answer.employee;
                const employeeID = employee.split(" ")[0];

                //This function allow the user to choose a manager for the selected employee
                function getManager() {
                    // An employee can't be a manager of himself
                    const ArrayIndex = employeesList.indexOf(employee);
                    employeesList.splice(ArrayIndex, 1);
                    return inquirer
                        .prompt({
                            message: `Assign a new manager to ${employee.split(" ")[1]} ${employee.split(" ")[2]}:`,
                            name: "manager",
                            type: "list",
                            choices: employeesList
                        })
                }
                const selected = await getManager();
                const manager = selected.manager;
                answer.manager_id = manager.split(" ")[0];
                const query = `UPDATE employee SET manager_id = '${answer.manager_id}' WHERE id ='${employeeID}'`;
                connection.query(query, function(err, res) {
                    if (err) throw err;
                    //Processing the query response
                    console.log("-------------------------")
                    console.log(`Update manager for employee: ${employee}. New manager: ${manager}`);
                    manageEmployees();
                })
            });
    };

    //This function  the user to add a new role
    function addRole(departmentsList) {
        inquirer
            .prompt([{
                message: "What is the title of the role you want to add?",
                name: "title",
                type: "input"
            }, {
                message: "What is the salary for this position?",
                name: "salary",
                type: "input"
            }, {
                message: "Select the department for this role:",
                name: "department",
                type: "list",
                choices: departmentsList
            }])
            .then(function(answer) {
                const departmentID = answer.department.split(" ")[0];
                const query = `INSERT INTO role (title, salary, department_id) VALUES ('${answer.title}', '${answer.salary}', '${departmentID}')`;
                connection.query(query, function(err, res) {
                    if (err) throw err;
                    //Printing the new role
                    console.log("-------------------------")
                    console.log(JSON.stringify(res))
                    console.log(`New role added id: ${res.insertId}, title: ${answer.title}`);
                    manageEmployees();
                })
            });
    };

    //This function prepare and return the sql database query for all employees data
    function employeesQuery(query) {
        query = "SELECT employee.*, role.title AS role, department.name AS department, role.salary FROM employee ";
        query += "INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (role.department_id = department.id) ";
        return query;
    }

    //This function make the sql database query and process the response
    function processResult(res) {
        //For each employee, loop to find the manager (the one the manager id belong to)
        res.forEach(element => {
            res.forEach(elmt => {
                if (element.manager_id == elmt.id) {
                    //Manager found
                    element.manager = `${elmt.first_name} ${elmt.last_name}`;
                }
            })
        });

        //This function print employees data
        setTimeout(function printEmployeesData() {
            res.forEach(employee => {
                delete employee.manager_id; // no more needed when manager found
                delete employee.role_id;
            });
            console.log("-----------------------------------------------------------------------------");
            console.table(res);
            manageEmployees();
        }, 300)

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
            query = "SELECT DISTINCT employee.manager_id FROM employee ORDER BY employee.manager_id";
        }
        connection.query(query, function(err, res) {
            if (err) throw err;
            return getTable(res)
        });
    }

    function employeeRoles(getRole) {
        //Database query
        let query = "SELECT * FROM role";
        connection.query(query, function(err, res) {
            if (err) throw err;
            return getRole(res)
        });
    }

}