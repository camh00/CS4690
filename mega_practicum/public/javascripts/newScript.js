document.addEventListener('DOMContentLoaded', () => {
    getUserRole().then(userRole => {
        // Show sections based on user role
        showSectionsBasedOnRole(userRole);

        // Fetch data and set up event listeners based on user role
        if (userRole === 1) { // Admin
            fetchCourses('admin');
            fetchLogs('admin');
            document.getElementById('createCourseForm').addEventListener('submit', handleCreateCourse);
            document.getElementById('createUserForm').addEventListener('submit', handleCreateUser);
        } else if (userRole === 2) { // Teacher
            fetchCourses('teacher');
            fetchLogs('teacher');
            document.getElementById('teacherCreateCourseForm').addEventListener('submit', handleCreateCourse);
            document.getElementById('teacherCreateUserForm').addEventListener('submit', handleCreateUser);
        } else if (userRole === 3) { // Student
            fetchCourses('student');
            fetchLogs('student');
        }
    });
});

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

function showSectionsBasedOnRole(role) {
    document.querySelectorAll('.role-section').forEach(section => section.style.display = 'none');
    if (role === 1) { // Admin
        document.getElementById('adminSection').style.display = 'block';
    } else if (role === 2) { // Teacher
        document.getElementById('teacherSection').style.display = 'block';
    } else if (role === 3) { // Student
        document.getElementById('studentSection').style.display = 'block';
    }
}

function fetchCourses(role) {
    fetch('/api/v1/courses')
        .then(response => response.json())
        .then(courses => {
            let coursesList;
            if (role === 1) {
                coursesList = document.getElementById('coursesList');
            } else if (role === 2) {
                coursesList = document.getElementById('teacherCoursesList');
            } else if (role === 3) {
                coursesList = document.getElementById('studentCoursesList');
            }
            coursesList.innerHTML = '';
            courses.forEach(course => {
                const li = document.createElement('li');
                li.textContent = course.display;
                coursesList.appendChild(li);
            });
        });
}

function fetchLogs(role) {
    fetch('/api/v1/logs')
        .then(response => response.json())
        .then(logs => {
            let logsList;
            if (role === 1) {
                logsList = document.getElementById('adminLogsList');
            } else if (role === 2) {
                logsList = document.getElementById('teacherLogsList');
            } else if (role === 3) {
                logsList = document.getElementById('studentLogsList');
            }
            logsList.innerHTML = '';
            logs.forEach(log => {
                const li = document.createElement('li');
                li.textContent = `${log.courseId} - ${log.uvuId}: ${log.text}`;
                logsList.appendChild(li);
            });
        });
}

function handleCreateCourse(e) {
    e.preventDefault();
    const courseName = e.target.querySelector('input[name="courseName"]').value;
    addCourse(courseName);
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
        fetchCourses(getUserRole());
        document.querySelector('input[name="courseName"]').value = '';
    });
}

function handleCreateUser(e) {
    e.preventDefault();
    const username = e.target.querySelector('input[name="username"]').value;
    const password = e.target.querySelector('input[name="password"]').value;
    const role = e.target.querySelector('select[name="role"]').value;
    createUser(username, password, role);
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
        alert('User created successfully!');
        document.getElementById('createUserForm').reset();
    });
}