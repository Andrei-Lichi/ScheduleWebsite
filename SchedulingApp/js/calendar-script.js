
const xml = '<schedule><week><day date="2021-12-24"></day><day date="2021-12-25"></day><day date="2021-12-26"></day><day date="2021-12-27"></day><day date="2021-12-28"><lesson colour="#993300"><course>SDJ</course><startTime>12:00</startTime><endTime>16:00</endTime><teacher>SVA</teacher><room></room></lesson></day><day date="2021-12-29"><lesson colour="#E6994D"><course>DMA</course><startTime>08:00</startTime><endTime>12:00</endTime><teacher>IO</teacher><room></room></lesson></day><day date="2021-12-30"></day></week></schedule>';



//Generate schedule on ready 
$().ready(_ => {
    xmlDoc = $.parseXML( xml );
    generateSchedule(xmlDoc);
})

function generateSchedule(xmlDoc) {
   const $xml = $(xmlDoc);
   let html = "";
   if($schedule = $($xml.find("schedule"))) {

        const scheduleStartTime = "7:00"; 
        const scheduleEndTime = "20:00"; 

        createScheduleBackground(scheduleStartTime,scheduleEndTime);
        
        const $days = $($schedule.find("day"));

        $days.each(function() {
            html += createHTMLDay(this,scheduleStartTime);
        });
   }
   $("#scheduleDaysWrapper").html(html);
}


function createScheduleBackground(startTime,endTime) {
    $("#schedule").append("<div class='scheduleHour text-start ps-1'></div>");
    for(let i = Math.floor(parseStringTimeToHours(startTime)); i <= Math.ceil(parseStringTimeToHours(endTime)); i++) {
        $("#schedule").append("<div class='scheduleHour text-start ps-1'>"+i+":00</div> ");
    }
}

let daysArray = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
function createHTMLDay(dayNode,scheduleStartTime) {
    const date = $(dayNode).attr("date");
    const $lessons = $($(dayNode).find("lesson"));
    const dayName = daysArray[parseInt(new Date(date).getDay())];

    let firstLettersSpan = '<span class="d-md-none">'+ dayName.slice(0,3) + '</span>';
    const dayNameSpan = '<span class="d-none d-md-inline">'+ dayName +'</span>';

    const dayNameNode = '<div class="text-center fs-4">'+firstLettersSpan+dayNameSpan+'</div>'
    const dateNode = '<div class="text-center d-none d-md-block">'+ date +'</div>'

    let html = '<div class="day position-relative h-100">' +dayNameNode + dateNode;

    $lessons.each(function() {
        html += createHTMLLesson(this,scheduleStartTime);
    })

    html += '</div>';

    return html;
}

function createHTMLLesson(lessonNode,scheduleStartTime) {
    
    // Reading all the values needed to display a lesson
    
    const course = $(lessonNode).find("course").text();
    const teacher = $(lessonNode).find("teacher").text();
    const room = $(lessonNode).find("room").text();
    const colour = $(lessonNode).attr("colour");
    const startTime = $(lessonNode).find("startTime").text();
    const endTime = $(lessonNode).find("endTime").text();
    
    const startTimeMin = parseStringTimeToMinutes(startTime); 
    const endTimeMin = parseStringTimeToMinutes(endTime);

    // Creating HTML Nodes 
    const courseNode = '<div class="text-white break-word fs-4 m-1 w-100">' + course +'</div>';
    const teacherNode = '<div class="text-white  ms-1 w-100">' + teacher +'</div>';
    const timeNode = '<div class="text-white ms-1  w-100">' + startTime + " - " + endTime +'</div>';
    const roomNode = '<div class="break-word text-white ms-1 w-100">' + room +'</div>';

    // Attributes of the lesson node
    const title = 'Course: '+ course + ' &#010Teacher: ' + teacher + ' &#010Time: '+ startTime + " - " + endTime  + '&#010Room: '+room;
    const classes = 'lesson flex-wrap flex-column overflow-hidden border-start border-end border-2 border-white position-absolute w-100 d-flex';
    
    // Position of the lesson and its length  
    const topVal = startTimeMin-parseStringTimeToMinutes(scheduleStartTime)+120;
    // One minute equals 1px on a calendar
    const length =  endTimeMin - startTimeMin;
    
    let html = '';
    html += '<div class="'+classes+'" title="'+title+'" style="background-color:'+colour+';top:'+topVal+'px;height:'+length+'px">';

    // Appending all nodes 
    html += courseNode + teacherNode + timeNode + roomNode;

    html += '</div>';
    return html;
}

function randColor() {
    return "hsl("+Math.floor(Math.random()*360)+",20%,50%)";
}

function parseStringTimeToMinutes(time) {
    time = time.split(":");
    return parseInt(time[0])*60 + parseInt(time[1]);
}

function parseStringTimeToHours(time) {
    time = time.split(":");
    return parseInt(time[0]) + parseInt(time[1])/60;
}



