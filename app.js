function createMathagram(terms) {
    let res = -1;
    let s = "";
    while (res < 0) {
        const nums = [];
        for (let i = 0; i < terms; ++i) {
            const randNum = Math.floor(Math.random() * 10) + 1;
            nums.push(randNum)
        }
        const ops = [];
        for (let i = 0; i < terms - 1; ++i) {
            const idx = Math.floor(Math.random() * 3);
            ops.push(idx);
        }
        // ops.forEach()
        ops.forEach(element => console.log(element));

        s = "";
        for (let i = 0; i < terms; ++i) {
            s += nums[i].toString();

            if (i != terms - 1) {
                s += " ";
                let to_add = "";
                switch (ops[i]) {
                    case 0:
                        to_add = "+";
                        break;
                    case 1:
                        to_add = "-";
                        break;
                    default:
                        to_add = "*";
                        break;
                }
                s += to_add;
                s += " ";
            }
        }
        res = eval(s)
    }
    s += " = " + res.toString();
    return s;
}

let expressionContainer;
let termsContainer;


function deleteExpression() {
    while (expressionContainer.firstChild) {
        expressionContainer.removeChild(expressionContainer.firstChild);
    }
    while (termsContainer.firstChild) {
        termsContainer.removeChild(termsContainer.firstChild);
    }
}

function loadExpression() {
    const mathagramContainer = document.getElementById("mathagram");
    expressionContainer = document.getElementById("expression");
    termsContainer = document.getElementById("terms");

    const mathagram = createMathagram(2);
    console.log("mathagram", mathagram)
    const terms = mathagram.split(/\s+/);

    // Display mathagram boxes at the bottom
    terms.forEach((term, index) => {
        if (term == '=') {
            return;
        }
        const box = createBox(term, index);
        termsContainer.appendChild(box);
    });

    // Display empty gray cells in the expression container
    terms.forEach((term, index) => {
        if (index == terms.length - 2) {
            const box = createBox("=", index);
            expressionContainer.appendChild(box);
        } else {
            const emptyCell = createEmptyCell();
            expressionContainer.appendChild(emptyCell);
        }
        // const emptyCell = createEmptyCell();
        // expressionContainer.appendChild(emptyCell);

    });
}

document.addEventListener("DOMContentLoaded", function () {


    // create equal sign
    // expressionContainer[expressionContainer.length - 2].term = '=';
    loadExpression();
    // Handle drag and drop for terms
    termsContainer.addEventListener("dragstart", handleDragStart);
    expressionContainer.addEventListener("dragover", handleDragOver);
    expressionContainer.addEventListener("drop", handleDrop);
});

function checkExpression() {
    let s = "";
    let res = "";
    let check_res = false;
    let works = true;
    // console.log("checking expression");
    Array.from(expressionContainer.childNodes).forEach((node, index) => {
        // console.log(node.childNodes);
        if (node.childNodes.length === 0) {
            // check if equal sign
            works = false;
        } else if (node.childNodes > 1) {
            // input validation
            works = false
        } else {
            let to_print;
            if (node.childNodes[0].dataset === undefined) {
                to_print = node.childNodes[0].data;
            } else {
                to_print = node.childNodes[0].dataset.value;
            }
            if (to_print == "=") {
                check_res = true;
            } else if (check_res) {
                res = to_print;
            } else {
                s += to_print + " ";
            }
            // console.log("value ", to_print);
        }
        // 
    });
    // console.log("works", works)
    // console.log("s", s);
    // res = parseInt(res)
    // console.log("res", res)
    // check validity of expression
    if (!works) return false;

    try {
        expr = eval(s)
        if (expr == res) {
            works = true
        } else works = false;
    } catch {
        works = false;
    }

    if (works) {
        deleteExpression();
        loadExpression();
    }
}

function createBox(term, index) {
    const box = document.createElement("div");
    box.className = "box";
    box.textContent = term;
    box.draggable = true;
    box.dataset.index = index;
    box.dataset.value = term
    box.addEventListener("dragstart", handleDragStart);
    return box;
}

function createEmptyCell() {
    const emptyCell = document.createElement("div");
    emptyCell.className = "empty-cell";
    emptyCell.addEventListener("dragover", handleDragOver);
    emptyCell.addEventListener("drop", handleDrop);
    return emptyCell;
}

function handleDragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.dataset.index);
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text/plain");
    const draggedBox = document.querySelector(`[data-index="${data}"]`);
    let term = draggedBox.dataset.value
    // draggedBox.

    // console.log("data", data)
    // console.log("term", term)
    // console.log("draggedBox", draggedBox)

    // Check if the drop target is an empty cell
    if (event.target.classList.contains("empty-cell")) {
        // Append the dragged box to the empty cell
        event.target.appendChild(draggedBox);

        // Mark the box as correct
        draggedBox.classList.add("correct");

        // Disable further dragging
        draggedBox.draggable = false;
        // console.log("checkexpr res", checkExpression());
        checkExpression();
    }
}
