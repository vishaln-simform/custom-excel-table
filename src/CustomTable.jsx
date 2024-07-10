import React, { useState, useEffect, useRef } from "react";
import "./CustomTable.css";

const CustomTable = () => {
  const initialRows = 10;
  const initialCols = 10;
  const [data, setData] = useState(
    Array.from({ length: initialRows }, () => Array(initialCols).fill(""))
  );
  const [selectedCells, setSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const tableRef = useRef();

  const handleMouseDown = (rowIndex, cellIndex) => {
    setSelectedCells([{ rowIndex, cellIndex }]);
    setIsSelecting(true);
  };

  const handleMouseOver = (rowIndex, cellIndex) => {
    if (isSelecting) {
      const startCell = selectedCells[0];
      const endCell = { rowIndex, cellIndex };
      const newSelectedCells = [];
      for (
        let i = Math.min(startCell.rowIndex, endCell.rowIndex);
        i <= Math.max(startCell.rowIndex, endCell.rowIndex);
        i++
      ) {
        for (
          let j = Math.min(startCell.cellIndex, endCell.cellIndex);
          j <= Math.max(startCell.cellIndex, endCell.cellIndex);
          j++
        ) {
          newSelectedCells.push({ rowIndex: i, cellIndex: j });
        }
      }
      setSelectedCells(newSelectedCells);
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  const handlePaste = (event) => {
    const clipboardData = event.clipboardData.getData("Text");
    const rows = clipboardData.split("\n").map((row) => row.split("\t"));
    const pastedValue = rows[0][0]; // Assuming single value paste

    const newData = [...data];
    selectedCells.forEach(({ rowIndex, cellIndex }) => {
      if (newData[rowIndex] && newData[rowIndex][cellIndex] !== undefined) {
        newData[rowIndex][cellIndex] = pastedValue;
      }
    });

    setData(newData);
  };

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [selectedCells, data]);

  useEffect(() => {
    const handleMouseUpOutside = () => setIsSelecting(false);
    document.addEventListener("mouseup", handleMouseUpOutside);
    return () => document.removeEventListener("mouseup", handleMouseUpOutside);
  }, []);

  return (
    <table ref={tableRef} onMouseLeave={handleMouseUp}>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                onMouseDown={() => handleMouseDown(rowIndex, cellIndex)}
                onMouseOver={() => handleMouseOver(rowIndex, cellIndex)}
                style={{
                  background: selectedCells.some(
                    (selected) =>
                      selected.rowIndex === rowIndex &&
                      selected.cellIndex === cellIndex
                  )
                    ? "lightblue"
                    : "white",
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CustomTable;
