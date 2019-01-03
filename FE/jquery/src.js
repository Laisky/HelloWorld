(function() {
    var logContainer = document.getElementById('console');

    $('#datepicker').datetimepicker({
        showOn: "both",
        minDate: 0,
        maxDate: "+7D",
        showTime: true,
        duration: false,
        showMinute: false,
        pickerTimeFormat: 'HH',
        timeFormat: 'HH:00',
        minTime: '8:00 am',
        maxTime: '6:00 pm',
        onSelect: function(dateText) {
            var log = document.createElement('p');
            log.textContent = dateText;
            logContainer.appendChild(log);
        }
    });
})()
