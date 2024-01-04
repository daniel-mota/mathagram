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


document.addEventListener("DOMContentLoaded", function () {
    const mathagramContainer = document.getElementById("mathagram");
    expressionContainer = document.getElementById("expression");
    termsContainer = document.getElementById("terms");

    const mathagram = createMathagram(2);
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

    // create equal sign
    // expressionContainer[expressionContainer.length - 2].term = '=';

    // Handle drag and drop for terms
    termsContainer.addEventListener("dragstart", handleDragStart);
    expressionContainer.addEventListener("dragover", handleDragOver);
    expressionContainer.addEventListener("drop", handleDrop);
});

function checkExpression() {
    let s = "";
    Array.from(expressionContainer.childNodes).forEach((term, index) => {
        // console.log(term);
    });
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

    console.log("data", data)
    // console.log("draggedBox", draggedBox)

    // Check if the drop target is an empty cell
    if (event.target.classList.contains("empty-cell")) {
        // Append the dragged box to the empty cell
        event.target.appendChild(draggedBox);

        // Mark the box as correct
        draggedBox.classList.add("correct");

        // Disable further dragging
        draggedBox.draggable = false;
        checkExpression();
    }
}
