window.addEventListener("load", function(){
    let btn = document.getElementById("btnCourse");
    btn.addEventListener("click", loadCourse);
});

function loadCourse(){
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = xhrHandler;
    let url = "http://localhost:3000/course-list.json"
    xhr.open("GET", url);
    xhr.send();
}

function xhrHandler(){
    // console.log(this.readyState);
    if(this.readyState!==4){
        return;
    }
    if(this.readyState !== 200){
        console.log("Not 200!");
    }
    let courseListDiv = document.getElementById("courseList");
    let courseList = JSON.parse(this.responseText);
    //console.log(courseList);
    courseList.map((course) => {
        courseListDiv.innerHTML += `<p>${course.courseName}, ${course.credit} credits<p>`
    });
    //courseListDiv.innerHTML = this.responseText;
}

