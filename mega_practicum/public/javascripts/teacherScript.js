document.addEventListener('DOMContentLoaded', () => {
    fetchCourses();
    fetchLogs();

    document.getElementById('createCourseForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const courseName = document.getElementById('courseName').value;
        addCourse(courseName);
    });

    document.getElementById('createUserForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        createUser(username, password, role);
    });
});

function fetchCourses() {
    fetch('/api/v1/courses')
        .then(response => response.json())
        .then(courses => {
            const coursesList = document.getElementById('coursesList');
            coursesList.innerHTML = '';
            courses.forEach(course => {
                const li = document.createElement('li');
                li.textContent = course.display;
                coursesList.appendChild(li);
            });
        });
}

function addCourse(courseName) {
    fetch('/api/v1/courses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: courseName, display: courseName }),
    })
    .then(response => response.json())
    .then(course => {
        fetchCourses();
        document.getElementById('courseName').value = '';
    });
}

function createUser(username, password, role) {
    fetch('/api/v1/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }),
    })
    .then(response => response.json())
    .then(user => {
        alert('User added successfully!');
        document.getElementById('createUserForm').reset();
    });
}

function fetchLogs() {
    fetch('/api/v1/logs')
        .then(response => response.json())
        .then(logs => {
            const logsList = document.getElementById('logsList');
            logsList.innerHTML = '';
            logs.forEach(log => {
                const li = document.createElement('li');
                li.textContent = `${log.courseId} - ${log.uvuId}: ${log.text}`;
                logsList.appendChild(li);
            });
        });
}

function displayIdField() {
    // Implement logic to display UVU ID field based on course selection
}

function checkLogs(uvuId) {
    // Implement logic to fetch and display logs based on UVU ID
}