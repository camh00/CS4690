// Practicum of: Cameron Hancock

'use strict';
// Populate course selections
let courseUrl = '/api/v1/courses';
const logUrl = '/api/v1/logs';
const userRoll = '3';

async function getUserRole() {
  try {
    const response = await fetch('/users/role');
    if (!response.ok) {
      throw new Error('Failed to fetch user role');
    }
    const data = await response.json();
    return data.role;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getUserRole().then(userRole => {
    this.userRole = userRole;
    // showSectionsBasedOnRole(userRole);
    if (userRole === 1) { // Admin
      document.getElementById('aminTeacherSection').style.display = 'block';
      setupCreateUserForm();
    } else if (userRole === 2) { // Teacher
      document.getElementById('aminTeacherSection').style.display = 'block';
      setupCreateStudentForm();
      fetchStudentCourses();
    } else {
      setupStudenLogForm();
    }
  });
});

// display all users
document.addEventListener('DOMContentLoaded', () => {
  fetch('/users')
    .then((response) => response.json())
    .then((users) => {
      const usersList = document.getElementById('userList');
      users.forEach((user) => {
        const li = document.createElement('li');
        switch (user.role) {
          case 1:
            user.role = 'admin';
            break;
          case 2:
            user.role = 'teacher';
            break;
          case 3:
            user.role = 'student';
            break;
          default:
            user.role = 'unknown';
        }
        const courses = user.courses.map(course => course.display).join(', ');
        li.textContent = `${user.username} - ${user.role} - Courses: ${courses}`;
        usersList.appendChild(li);
      });
    })
    .catch((err) => console.log(err));
});

document.addEventListener('DOMContentLoaded', () => {
  const enrollUserForm = document.getElementById('enrollUserForm');

  enrollUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const courseDisplay = document.getElementById('courseDisplay').value;

    try {
      const response = await fetch('/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, courseDisplay }),
      });

      if (response.ok) {
        alert('User enrolled successfully!');
        enrollUserForm.reset();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });
});

// display all courses
document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/v1/courses')
    .then((response) => response.json())
    .then((courses) => {
      const coursesList = document.getElementById('courseList');
      courses.forEach((course) => {
        const li = document.createElement('li');
        const students = course.users.map(user => user.username).join(', ');
        li.textContent = `${course.display} - Students: ${students}`;
        coursesList.appendChild(li);
      });
    })
    .catch((err) => console.log(err));
});

// Add User
function setupCreateUserForm() {
  const createUserForm = document.getElementById('createUser');
  createUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const school = document.querySelector('head > title').textContent;

    try {
      const response = await fetch('/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, school, role }),
      });

      if (response.ok) {
        alert('User created successfully!');
        createUserForm.reset();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });
}

function setupCreateStudentForm() {
  document.getElementById('userCreationTitle').textContent = 'Create a Student';
  document.getElementById('roleSelection').style.display = 'none';
  const createUserForm = document.getElementById('createUser');
  createUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('password').value;
    const role = 3; // Force role to student
    const school = document.querySelector('head > title').textContent;

    try {
      const response = await fetch('/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, school, role }),
      });

      if (response.ok) {
        alert('Student created successfully!');
        createUserForm.reset();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });
}

// Fetch courses from db
function fetchCourses() {
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
}

// Hide id field until a course has been selected
function displayIdField() {
  if (document.getElementById('course').value === 'Choose Courses' || userRole === 3) {
    document.getElementById('logUsername').style.display = 'none';
  } else {
    document.getElementById('logUsername').style.display = 'inline';
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
function checkLogs(username) {
  document.getElementById('usernameDisplay').textContent =
    'Student Logs for: ' + username;
  document.getElementById('logs').innerHTML = '';
  const courseID =
    document.getElementById('course').options[
      document.getElementById('course').selectedIndex
    ].id;
  if (username.length == 8) {
    fetch(logUrl + '?courseId=' + courseID + '&username=' + username)
      .then((response) => response.json())
      .then((logs) => {
        console.log(logs);
        if (logs.length === 0) {
          let li = document.createElement('li');
          let p = document.createElement('p');
          p.textContent = 'No logs found';
          li.appendChild(p);
          document.getElementById('logs').appendChild(li);
        } else {
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
        }
      })
      .catch((err) => console.log(err));
  }
}

// Hide logs if clicked on and show logs if clicked again
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
  if (userRole === 3) {
    document.getElementById('submit').disabled = false;
  } else if (
    document.getElementById('uvuId').value.length < 8 ||
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
      document.getElementById('course').value,
    username: document.getElementById('logUsername').value,
    text: document.getElementById('logTextArea').value,
  };
  fetch(logUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((result) => {
      console.log('Success:', result);
      alert('Log submitted successfully!');
      document.getElementById('logTextArea').value = '';
      checkLogs(document.getElementById('logUsername').value);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Function to add a new course
function addCourse() {
  const courseName = document.getElementById('courseName').value.trim();

  // Check if courseName is empty
  if (!courseName) {
    alert('Course name cannot be empty');
    return;
  }

  // Fetch existing courses
  fetch(courseUrl)
    .then((response) => response.json())
    .then((courses) => {

      // Check if courseName already exists
      const courseExists = courses.some(course => course.display === courseName);
      if (courseExists) {
        alert('Course already exists');
        return;
      }

      // Send POST request to add the course
      const data = { id: courseName.toLowerCase().replace(/\s+/g, ''), display: courseName };
      fetch(courseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((result) => {
          console.log('Success:', result);
          alert('Course added successfully!');
          document.getElementById('course').value = '';
          location.reload();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    })
    .catch((error) => {
      console.error('Error fetching courses:', error);
    });
}
fetchCourses();
// Add event listener to the button
document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('addCourse').addEventListener('click', addCourse);
});

function openTab(evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "flex";
  evt.currentTarget.className += " active";
}

// Set default tab to open
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.tablinks').click();
});

async function fetchStudentCourses() {
  try {
    const response = await fetch('/api/v1/course/my');
    if (!response.ok) {
      throw new Error('Failed to fetch student courses');
    }
    const courses = await response.json();
    const courseSelect = document.getElementById('course');
    courseSelect.innerHTML = ''; // Clear existing options
    courses.forEach(course => {
      const option = document.createElement('option');
      option.value = course._id;
      option.textContent = course.display;
      courseSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching student courses:', error);
  }
}

async function setupStudenLogForm() {
  document.getElementById('logUsername').style.display = 'none';
  document.getElementById('usernameLabel').style.display = 'none';
  document.getElementById('usernameDisplay').textContent = 'Student Logs:';
  document.getElementById('course').addEventListener('change', disableButton);
  document.getElementById('logTextArea').addEventListener('input', disableButton);
  const usernameResponse = await fetch('/users/me');
  if (!usernameResponse.ok) {
    throw new Error('Failed to fetch current user');
  }
  const userData = await usernameResponse.json();
  document.getElementById('logUsername').value = userData.username;
  try {
    const response = await fetch('/api/v1/courses/my');
    if (!response.ok) {
      throw new Error('Failed to fetch student courses');
    }
    const courses = await response.json();
    const courseSelect = document.getElementById('course');
    courseSelect.innerHTML = ''; // Clear existing options
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a course';
    courseSelect.appendChild(defaultOption);
    courses.forEach(course => {
      const option = document.createElement('option');
      option.value = course.display;
      option.textContent = course.display;
      courseSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching student courses:', error);
  }
}