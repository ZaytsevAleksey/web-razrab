document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('modalOverlay');
  if (!overlay) return;
  const modalLogin = document.getElementById('modalLogin');
  const modalRegister = document.getElementById('modalRegister');
  const openButtons = document.querySelectorAll('.open-modal');
  const closeButtons = overlay.querySelectorAll('.modal-close');
  const switchers = overlay.querySelectorAll('.modal-switch');

  function openModal(target) {
    if (target === 'login') {
      modalLogin.hidden = false;
      modalRegister.hidden = true;
    } else if (target === 'register') {
      modalRegister.hidden = false;
      modalLogin.hidden = true;
    }
    overlay.hidden = false;
    overlay.classList.add('active');
  }

  function closeModal() {
    overlay.classList.remove('active');
    overlay.hidden = true;
    modalLogin.hidden = true;
    modalRegister.hidden = true;
    overlay.querySelectorAll('form').forEach(form => form.reset());
  }

  openButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.modal;
      openModal(target);
    });
  });

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
      console.log('Вход:', data);
      closeModal();
    });
  }

  const formRegister = document.getElementById('formRegister');
  if (formRegister) {
    formRegister.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(formRegister);
      const data = Object.fromEntries(formData.entries());

      if (data.password !== data.password2) {
        alert('Пароли не совпадают');
        return;
      }
      console.log('Регистрация:', data);
      closeModal();
    });
  }
});