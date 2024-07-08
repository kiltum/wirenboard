defineVirtualDevice("actual_time", {
    title: "Текущее время",
    cells: {
        time: {
            title: "Time",
            type: "string",
            value: ""
        }
    }
});

setInterval(function() {
    var currentTime = new Date(); // Получение текущей даты и времени
    var timeString = currentTime.toLocaleTimeString(); // Получение строки времени (часы:минуты:секунды);

    dev["actual_time/time"] = timeString; // Установка времени в ячейку устройства "actual_time"
}, 2000);
