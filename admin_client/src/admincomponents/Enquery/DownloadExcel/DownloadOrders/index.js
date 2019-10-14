import React from "react";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function downloadOrders(fullData) {
    let formatData = [];

    for (let i = 0; i < fullData.length; i++) {
        const data = fullData[i];
        let dataObj = {};
        dataObj.user = data.user.username;
        dataObj.status = data.status;
        dataObj.total = data.total;
        let date = new Date();
        date.setTime(date);
        dataObj.date = date.toString();
        let orderData = "";
        for (let j = 0; j < data.fullOrder.length; j++) {
            const product = data.fullOrder[j];
            const orderStr = `${product.productName} Код:${product.productId} ${parseFloat(product.orderedPrice).toFixed(2)} лв x ${product.stock} Общо: ${parseFloat(product.productTotal).toFixed(2)} лв \n`;
            orderData = orderData + orderStr;
        }
        dataObj.order = orderData;
        formatData.push(dataObj);
    }
    return (
        <ExcelSheet data={formatData} name="Employees">
            <ExcelColumn label="User" value="user" />
            <ExcelColumn label="Status" value="status" />
            <ExcelColumn label="Date" value="date" />
            <ExcelColumn label="Products" value="order" />
            <ExcelColumn label="Total" value="total" />
        </ExcelSheet>
    );
}