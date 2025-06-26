//global
let showCell = [
  [true, true, true],
  [true, true, true],
  [true, true, true],
];

class MagicSquare {
}

// Function to update the table with values from an array
function updateTableFromArray(tableArray) {
  const table = document.getElementById("magic-square"); // Select the table by ID
  table.innerHTML = ""; // Clear existing table content

  tableArray.forEach((row, rowIndex) => {
    const tableRow = document.createElement("tr");
    row.forEach((cell, cellIndex) => {
      const tableCell = document.createElement("td"); // Create a new table cell
      tableCell.textContent = showCell[rowIndex][cellIndex] ? cell : ""; // Set the cell content to the array value
      tableRow.appendChild(tableCell); // Add the cell to the row
    });
    table.appendChild(tableRow); // Add the row to the table
  });

  //get and sort values in the array
  let values = [];
  for (let i = 1; i <= 9; i++) {
    values.push(tableArray[Math.floor((i - 1) / 3)][(i - 1) % 3]);
  }
  values.sort((a, b) => a - b);
  document.getElementById("values").innerHTML = values.join(", ");
}

// Update table based on values
function updateTable(a, b, c, reflectx, reflecty, rotate) {
  let tableArray = [
    [c - b, c + a + b, c - a],
    [c - a + b, c, c + a - b],
    [c + a, c - a - b, c + b],
  ];

  if (reflectx) {
    tableArray = reflectHorizontal(tableArray);
  }
  if (reflecty) {
    tableArray = reflectVertical(tableArray);
  }
  if (rotate) {
    const n = rotate / 90;
    for (let i = 0; i < n; i++) {
      tableArray = rotate90(tableArray);
    }
  }
  updateTableFromArray(tableArray);
}

function updateFromForm() {
  const a = parseFloat(document.getElementById("a").value);
  const b = parseFloat(document.getElementById("b").value);
  const c = parseFloat(document.getElementById("c").value);
  const reflectx = document.getElementById("reflectx").checked;
  const reflecty = document.getElementById("reflecty").checked;
  const rotate = document.querySelector('input[name="rotate"]:checked').value;
  updateTable(a, b, c, reflectx, reflecty, rotate);
}

function reflectHorizontal(tableArray) {
  return tableArray.map((row) => row.slice().reverse());
}

function reflectVertical(tableArray) {
  return tableArray.slice().reverse();
}

function rotate90(tableArray) {
  return tableArray[0].map((val, index) =>
    tableArray.map((row) => row[index]).reverse(),
  );
}

// Call the function to initially populate the table
document.addEventListener("DOMContentLoaded", function () {
  updateFromForm();
  document.getElementById("function").addEventListener("input", updateFromForm);
  // Add event listener to show/hide cells when clicked
  document
    .getElementById("magic-square")
    .addEventListener("click", function (event) {
      if (event.target.tagName === "TD") {
        const rowIndex = event.target.parentNode.rowIndex;
        const cellIndex = event.target.cellIndex;
        showCell[rowIndex][cellIndex] = !showCell[rowIndex][cellIndex];
        updateFromForm();
      }
    });
});
