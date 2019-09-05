var m = new Date(document.lastModified);
var str = "最終更新日：" + m.getFullYear() + "年" + (m.getMonth()+1) + "月" + m.getDate() + "日";
document.getElementById("last_modify").innerHTML = str;
