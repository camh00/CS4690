// Practicum of: Cameron Hancock
// DONE: Wire up the app's behavior here.
// NOTE: The TODOs are listed in index.html

// Populate course selections
const courseUrl =
  '/api/v1/courses';

fetch(courseUrl)
  .then((response) => response.json())
  .then((crses) => {
    for (let i = 0; i < crses.length; i++) {
      let optionContent = crses[i]['display'];
      let el = document.createElement('option');
      el.textContent = optionContent;
      el.id = crses[i]['id'];
      document.getElementById('course').appendChild(el);
    }
  })
  .catch((err) => console.log(err));

// Hide id field until a course has been selected
function displayIdField() {
  if (document.getElementById('course').value === 'Choose Courses') {
    document.getElementById('uvuId').style.display = 'none';
  } else {
    document.getElementById('uvuId').style.display = 'inline';
  }
}

// If input fields are empty display a red border
function checkInputField(id) {
  if (document.getElementById(id).value == '') {
    document.getElementById(id).style.borderColor = 'red';
  } else {
    document.getElementById(id).style.borderColor = 'white';
  }
}

// search for logs from selected course and uvu id
function checkLogs(uvuID) {
  document.getElementById('uvuIdDisplay').textContent =
    'Student Logs for: ' + uvuID;
  document.getElementById('logs').innerHTML = '';
  const courseID =
    document.getElementById('course').options[
      document.getElementById('course').selectedIndex
    ].id;
  if (uvuID.length == 8) {
    fetch(
      '/api/v1/logs?courseId=' +
        courseID +
        '&uvuId=' +
        uvuID
    )
      .then((response) => response.json())
      .then((logs) => {
        console.log(logs);
        const logsList = $('#logsList');
        for (let i = 0; i < logs.length; i++) {
          let li = document.createElement('li');

          let div = document.createElement('div');
          let small = document.createElement('small');
          small.textContent = logs[i]['date'];
          div.appendChild(small);

          let pre = document.createElement('pre');
          let p = document.createElement('p');
          p.id = 'logData';
          p.textContent = logs[i]['text'];
          pre.appendChild(p);

          li.appendChild(div);
          li.appendChild(pre);

          document.getElementById('logs').appendChild(li);
        }
      })
      .catch((err) => console.log(err));
  }
}

// Hide logs if clocked on and show logs if clicked again
function hideLogs() {
  const logs = document.querySelectorAll('#logData');
  const hidden = document
    .getElementById('logData')
    .classList.contains('hidden');
  logs.forEach((p) => {
    if (hidden) {
      p.classList.remove('hidden');
    } else {
      p.classList.add('hidden');
    }
  });
}

// disable submit button until all forms are filled in
function disableButton() {
  if (
    document.getElementById('logs').childElementCount === 0 ||
    document.getElementById('logTextArea').value === ''
  ) {
    document.getElementById('submit').disabled = true;
  } else {
    document.getElementById('submit').disabled = false;
  }
}

// PUT new log into db
function submitLog() {
  const data = {
    courseId:
      document.getElementById('course').options[
        document.getElementById('course').selectedIndex
      ].id,
    uvuId: document.getElementById('uvuId').value,
    text: document.getElementById('logTextArea').value,
  };
  fetch(
    '/api/v1/logs',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Parse the response as JSON
    })
    .then((result) => {
      console.log('Success:', result);
    })
    .catch((error) => {
      console.eror('Error:', error);
    });
}
