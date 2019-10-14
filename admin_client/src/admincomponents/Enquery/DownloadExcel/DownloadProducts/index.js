import React from "react";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function downloadOrders(data) {
    return (
        <ExcelSheet data={data} name="Employees">
            <ExcelColumn label="Product" value="name" />
            <ExcelColumn label="Id" value="id" />
            <ExcelColumn label="Stock" value="stock" />
        </ExcelSheet>
    );
}