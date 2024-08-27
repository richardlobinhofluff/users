document.addEventListener('DOMContentLoaded', () => {
    const usersList = document.getElementById('users-list');
    const createUserBtn = document.getElementById('create-user-btn');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');

    // Fetch and display users
    function fetchUsers() {
        fetch('/users')
            .then(response => response.json())
            .then(users => {
                usersList.innerHTML = '';
                users.forEach(user => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        ${user.name} (${user.email})
                        <div>
                            <button onclick="deleteUser(${user.id})">Delete</button>
                            <button onclick="editUser(${user.id}, '${user.name}', '${user.email}')">Edit</button>
                        </div>
                    `;
                    usersList.appendChild(li);
                });
            })
            .catch(error => console.error('Error fetching users:', error));
    }

    // Create a new user
    createUserBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();

        if (name && email) {
            fetch('/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email })
            })
            .then(response => response.json())
            .then(() => {
                fetchUsers();
                nameInput.value = '';
                emailInput.value = '';
            })
            .catch(error => console.error('Error creating user:', error));
        }
    });

    // Delete a user
    window.deleteUser = function(id) {
        fetch(`/users/${id}`, { method: 'DELETE' })
            .then(() => fetchUsers())
            .catch(error => console.error('Error deleting user:', error));
    }

    // Edit a user
    window.editUser = function(id, currentName, currentEmail) {
        const newName = prompt('Enter new name:', currentName);
        const newEmail = prompt('Enter new email:', currentEmail);

        if (newName && newEmail) {
            fetch(`/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, email: newEmail })
            })
            .then(() => fetchUsers())
            .catch(error => console.error('Error updating user:', error));
        }
    }

    // Initial fetch
    fetchUsers();
});