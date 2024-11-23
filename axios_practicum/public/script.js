// Practicum of: Cameron Hancock
// DONE: Wire up the app's behavior here.
// NOTE: The TODOs are listed in index.html

// Populate course selections
const courseUrl =
  'https://json-server-62gvpr--3000.local-credentialless.webcontainer.io/api/v1/courses';
axios
  .get(courseUrl)
  .then(function (response) {
    let crses = response.data;
    for (let i = 0; i < crses.length; i++) {
      let optionContent = crses[i]['display'];
      let el = document.createElement('option');
      el.textContent = optionContent;
      el.id = crses[i]['id'];
      document.getElementById('course').appendChild(el);
    }
  })
  .catch((err) => console.log(err));

// Check user and OS theme preference and set accordingly
let theme = 'unknown';
// Check local storage for user preference
try {
  theme = localStorage.getItem('theme');
  if (theme === 'light') {
    console.log('User Pref: light');
    theme = 'style.css';
  } else if (theme === 'dark') {
    console.log('User Pref: dark');
    theme = 'style-dark.css';
  } else {
    console.log('User Pref: unknown');
    theme = 'unknown';
  }
} catch {
  console.log('User Pref: unknown');
  theme = 'unknown';
}
// check prefers-color-scheme for OS preference
if (
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
) {
  console.log('OS Pref: dark');
  document.getElementById('stylesheet').href =
    theme === 'unknown' ? 'style-dark.css' : theme;
} else if (
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: light)').matches
) {
  console.log('OS Pref: light');
} else {
  console.log('OS Pref: unknown');
}

// swap between light and dark themes
function changeTheme() {
  var currentTheme = document.getElementById('stylesheet');
  if (currentTheme.href.includes('style.css')) {
    currentTheme.href = 'style-dark.css';
    localStorage.setItem('theme', 'dark');
  } else if (currentTheme.href.includes('style-dark.css')) {
    currentTheme.href = 'style.css';
    localStorage.setItem('theme', 'light');
  }
}

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
    axios
      .get(
        'https://json-server-62gvpr--3000.local-credentialless.webcontainer.io/api/v1/logs?courseId=' +
          courseID +
          '&uvuId=' +
          uvuID
      )
      .then(function (response) {
        let logs = response.data;
        console.log(logs);
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
  axios.post(
    'https://json-server-62gvpr--3000.local-credentialless.webcontainer.io/api/v1/logs',
    {
      courseId:
        document.getElementById('course').options[
          document.getElementById('course').selectedIndex
        ].id,
      uvuId: document.getElementById('uvuId').value,
      text: document.getElementById('logTextArea').value,
    }
  );
}
