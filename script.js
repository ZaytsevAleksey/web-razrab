document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('modalOverlay');
  if (!overlay) return;
  const modalLogin = document.getElementById('modalLogin');
  const modalRegister = document.getElementById('modalRegister');
  const openButtons = document.querySelectorAll('.open-modal');
  const closeButtons = overlay.querySelectorAll('.modal-close');
  const switchers = overlay.querySelectorAll('.modal-switch');

  // Функция открытия модалки
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

  // Функция закрытия модалки
  function closeModal() {
    overlay.classList.remove('active');
    overlay.hidden = true;
    modalLogin.hidden = true;
    modalRegister.hidden = true;
    overlay.querySelectorAll('form').forEach(form => form.reset());
  }

  // Добавляем обработчики событий на кнопки открытия модалок
  openButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.modal;
      openModal(target);
    });
  });

  // Добавляем обработчики событий на кнопки закрытия модалок
  closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
  });

  // Закрытие модалки при клике вне окна
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  // Добавляем обработчики переключателей между модалками
  switchers.forEach(switcher => {
    switcher.addEventListener('click', () => {
      const target = switcher.dataset.target;
      openModal(target);
    });
  });

  // Обработка отправки формы Входа
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

  // Обработка отправки формы Регистрации
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