class TimeblockObj {
  constructor(hour, text) {
    this.hour = hour;
    this.text = text;
  }
}
// The functions for displaying the application properly //
window.onload = function() {
  const currentTimeblocks = getCurrentTimeblocks();
  const currentTime = dayjs();

  displayCurrentDate(currentTime);
  displayTimeblockRows(currentTime);
  setTimeblockText(currentTimeblocks);

  document.querySelector('.container')
    .addEventListener('click', function(event) {
      containerClicked(event, currentTimeblocks);
  });

  (function () {
    function checkTime(i) {
        return (i < 10) ? "0" + i : i;
    }
  
    function startTime() {
        var today = new Date(),
            h = checkTime(today.getHours()),
            m = checkTime(today.getMinutes()),
            s = checkTime(today.getSeconds());
        document.getElementById('time').innerHTML = h + ":" + m + ":" + s;
        t = setTimeout(function () {
            startTime()
        }, 500);
    }
    startTime();
  })();

};

function getCurrentTimeblocks() {
  const currentTimeblocks = localStorage.getItem('timeblockObjects');
  return currentTimeblocks ? JSON.parse(currentTimeblocks) : [];
}

function displayCurrentDate(currentTime) {
  document.getElementById('currentDay')
    .textContent = currentTime.format('dddd, MMMM D YYYY');
}

// The functions for displaying all the timeblock rows //
function displayTimeblockRows(currentTime) {
  const currentHour = currentTime.hour();
 
  for (let i = 9; i <= 17; i ++) {
    const timeblock = createTimeblockRow(i);
    const hourCol = createCol(createHourDiv(i), 1);
    const textArea = createCol(createTextArea(i, currentHour), 10);
    const saveBtn = createCol(createSaveBtn(i), 1);
    appendTimeblockColumns(timeblock, hourCol, textArea, saveBtn);
    document.querySelector('.container').appendChild(timeblock);
  }
}

function createTimeblockRow(hourId) {
  const timeblock = document.createElement('div');
  timeblock.classList.add('row');
  timeblock.id = `timeblock-${hourId}`;
  return timeblock;
}

function createCol(element, colSize) {
  const col = document.createElement('div');
  col.classList.add(`col-${colSize}`,'p-0');
  col.appendChild(element);
  return col;
}

function createHourDiv(hour) {
  const hourCol = document.createElement('div');
  hourCol.classList.add('hour');
  hourCol.textContent = formatHour(hour);
  return hourCol;
}

function formatHour(hour) {
  const hourString = String(hour);
  return dayjs().hour(hour).format('hA');
  }

function createTextArea(hour, currentHour) {
  const textArea = document.createElement('textarea');
  textArea.classList.add(getTextAreaBackgroundClass(hour, currentHour));
  return textArea;
}

function getTextAreaBackgroundClass(hour, currentHour) {
  return hour < currentHour ? 'past' 
    : hour === currentHour ? 'present' 
    : 'future';
}

function createSaveBtn(hour) {
  const saveBtn = document.createElement('button');
  saveBtn.classList.add('saveBtn');
  saveBtn.innerHTML = '<i class="fas fa-save"></i>';
  saveBtn.setAttribute('data-hour', hour);
  return saveBtn;
}

function appendTimeblockColumns(timeblockRow, hourCol, textAreaCol, saveBtnCol) {
  const innerCols = [hourCol, textAreaCol, saveBtnCol];
  for (let col of innerCols) {
    timeblockRow.appendChild(col);
  }
}

// The functions for saving to the local storage //
function containerClicked(event, timeblockList) {
  if (isSaveButton(event)) {
    const timeblockHour = getTimeblockHour(event);
    const textAreaValue = getTextAreaValue(timeblockHour);
    placeTimeblockInList(new TimeblockObj(timeblockHour, textAreaValue), timeblockList);
    saveTimeblockList(timeblockList);
  }
}

function isSaveButton(event) {
  return event.target.matches('button') || event.target.matches('.fa-save');
}

function getTimeblockHour(event) {
  return event.target.matches('.fa-save') ? event.target.parentElement.dataset.hour : event.target.dataset.hour;
}

function getTextAreaValue(timeblockHour) {
  return document.querySelector(`#timeblock-${timeblockHour} textarea`).value;
}

function placeTimeblockInList(newTimeblockObj, timeblockList) {
  if (timeblockList.length > 0) {
    for (let savedTimeblock of timeblockList) {
      if (savedTimeblock.hour === newTimeblockObj.hour) {
        savedTimeblock.title = newTimeblockObj.title;
        return;
      }
    }
  } 
  timeblockList.push(newTimeblockObj);
  return;
}

function saveTimeblockList(timeblockList) {
  localStorage.setItem('timeblockObjects', JSON.stringify(timeblockList));
}

function setTimeblockText(timeblockList) {
  if (timeblockList.length === 0 ) {
    return;
  } else {
    for (let timeblock of timeblockList) {
      const textArea = document.querySelector(`#timeblock-${timeblock.hour} textarea`);
      textArea.value = timeblock.title;
    }
  }
}