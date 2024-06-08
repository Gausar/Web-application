"use strict";

class DatePicker{
    constructor(divId, callback){
        this.divId = divId;
        this.callback = callback;
        this.ognoo = null;
    }
    render(date){
        var calender = document.getElementById(this.divId);
        calender.appendChild(this.createCal(date));
    }
    createHeader(table, date){
        var header = table.createTHead();
        var hRow = header.insertRow(0);
        var left = hRow.insertCell(0);
        left.colSpan = "2";
        left.innerHTML="<b>&lt</b>";
        left.setAttribute("id", "leftArrow");
        left.addEventListener("click",() => {
			table.remove();
			date.setMonth(date.getMonth()-1);
			this.render(date);
		});
        
        var monthValue = hRow.insertCell(1);
        var months = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];
        monthValue.innerHTML=months[date.getMonth()] + "    " + date.getFullYear();
        monthValue.colSpan = "3";
        monthValue.style.border = "none";

        var right = hRow.insertCell(2);
        right.innerHTML="<b>&gt</b>";
        right.setAttribute("id", "rightArrow");
        right.colSpan = "2";
        

		right.addEventListener("click",() => {
			table.remove();
			date.setMonth(date.getMonth()+1);
			this.render(date);
		});

        return header;
    }
    createCal(date){
        var table = document.createElement("table");
        var header = this.createHeader(table, date);

        const days = ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"];
        const hRow = header.insertRow(1);
        for(let i = 0; i < 7; i++){
            const value = hRow.insertCell(i);
            value.innerHTML = days[i];
            value.style.color = "yellow";
        }
        
        const today = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        const iteratorDay = new Date(startDate);

        var rowIndex = 2;
        while(iteratorDay <= lastDay){
            const row = table.insertRow(rowIndex);
            rowIndex++;
            for(let i = 0; i < 7; i++){
                const value = row.insertCell(i);
                value.innerHTML = iteratorDay.getDate();

                if(iteratorDay.getMonth() !== date.getMonth()){
                    value.setAttribute("id", "otherMonth");
                }
                else{
                    var a;
                    value.setAttribute("id", "currentMonth");
                    this.ognoo = {
                        month: iteratorDay.getMonth(),
                        day: value.innerHTML,
                        year: iteratorDay.getFullYear()
                    };
                    if (iteratorDay.toDateString() === today.toDateString()) {
                        value.style.background = "#365770";
                    }
                    value.addEventListener("click", () => {
                        this.callback(this.divId, this.ognoo);
                    });
                }
                a = 1;
                iteratorDay.setDate(iteratorDay.getDate() + 1);
            }
        }
        return table;
    }


}