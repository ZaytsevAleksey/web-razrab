let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('modalOverlay');
  if (!overlay) return;
  
  const modalLogin = document.getElementById('modalLogin');
  const modalRegister = document.getElementById('modalRegister');
  const modalProfile = document.getElementById('modalProfile');
  const openButtons = document.querySelectorAll('.open-modal');
  const closeButtons = overlay.querySelectorAll('.modal-close');
  const switchers = overlay.querySelectorAll('.modal-switch');

  const guestButtons = document.getElementById('guestButtons');
  const userButtons = document.getElementById('userButtons');
  const profileBtn = document.getElementById('profileBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  const profileDate = document.getElementById('profileDate');

  function initAuthUI() {
    if (currentUser) {
      showUserButtons();
      updateProfileInfo();
    } else {
      showGuestButtons();
    }
  }

  function showUserButtons() {
    if (guestButtons) guestButtons.style.display = 'none';
    if (userButtons) userButtons.style.display = 'flex';
  }

  function showGuestButtons() {
    if (guestButtons) guestButtons.style.display = 'flex';
    if (userButtons) userButtons.style.display = 'none';
  }

  function updateProfileInfo() {
    if (currentUser && profileName && profileEmail && profileDate) {
      profileName.textContent = currentUser.name || 'Not set';
      profileEmail.textContent = currentUser.email;
      profileDate.textContent = new Date(currentUser.createdAt).toLocaleDateString();
    }
  }

  function login(userData) {
    currentUser = {
      ...userData,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    initAuthUI();
    closeModal();
  }

  function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    initAuthUI();
    closeModal();
  }

  function openModal(target) {
    if (target === 'login') {
      modalLogin.hidden = false;
      modalRegister.hidden = true;
      modalProfile.hidden = true;
    } else if (target === 'register') {
      modalRegister.hidden = false;
      modalLogin.hidden = true;
      modalProfile.hidden = true;
    } else if (target === 'profile') {
      modalProfile.hidden = false;
      modalLogin.hidden = true;
      modalRegister.hidden = true;
      updateProfileInfo();
    }
    overlay.hidden = false;
    overlay.classList.add('active');
  }

  function closeModal() {
    overlay.classList.remove('active');
    overlay.hidden = true;
    modalLogin.hidden = true;
    modalRegister.hidden = true;
    if (modalProfile) modalProfile.hidden = true;
    overlay.querySelectorAll('form').forEach(form => form.reset());
  }

  function loadRegisteredUsers() {
    fetch('save_data.php?action=getUsers')
      .then(response => response.json())
      .then(users => {
        registeredUsers = users;
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      })
      .catch(error => {
        console.error('Error loading users:', error);
        registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
      });
  }

  function authenticateUser(email, password) {
    return registeredUsers.find(user => 
      user.email === email && user.password === password
    );
  }

  function emailExists(email) {
    return registeredUsers.some(user => user.email === email);
  }

  initAuthUI();
  loadRegisteredUsers();

  openButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.modal;
      openModal(target);
    });
  });

  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      openModal('profile');
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to logout?')) {
        logout();
      }
    });
  }

  closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  switchers.forEach(switcher => {
    switcher.addEventListener('click', () => {
      const target = switcher.dataset.target;
      openModal(target);
    });
  });

  const formLogin = document.getElementById('formLogin');
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(formLogin);
      const data = Object.fromEntries(formData.entries());
      
      const user = authenticateUser(data.email, data.password);
      if (user) {
        login({
          email: user.email,
          name: user.name,
          password: user.password
        });
        alert('Login successful!');
      } else {
        alert('Invalid email or password!');
      }
    });
  }

const formRegister = document.getElementById('formRegister');
if (formRegister) {
  formRegister.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(formRegister);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.password2) {
      alert('Passwords do not match!');
      return;
    }

    if (emailExists(data.email)) {
      alert('Email already registered!');
      return;
    }

    const newUser = {
      name: data.name,
      email: data.email,
      password: data.password,
      createdAt: new Date().toISOString()
    };
    
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    saveToFile('register_data.txt', data);
    
    login(newUser);
    
    alert('Registration successful!');
  });
}

function saveToFile(filename, data) {
  fetch('save_data.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filename: filename,
      data: data,
      action: 'register' 
    }),
  })
  .then(response => response.text())
  .then(result => {
    console.log('Registration data saved:', result);
  })
  .catch(error => {
    console.error('Error saving registration:', error);
  });
}

  const dropdownLink = document.querySelector('.nav__link--dropdown');
  const dropdownMenu = document.querySelector('.nav__dropdown');

  if (dropdownLink && dropdownMenu) {
    dropdownLink.addEventListener('click', function(event) {
      event.preventDefault();
      dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
      dropdownLink.classList.toggle('active');
    });
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
  }

  document.querySelectorAll('.nav_link').forEach(link => {
    link.addEventListener('click', function() {
      nav.classList.remove('active');
    });
  });
});