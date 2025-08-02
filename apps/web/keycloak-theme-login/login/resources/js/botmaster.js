// Adiciona classe para detectar modo escuro
document.addEventListener('DOMContentLoaded', () => {
  // Check for system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (prefersDark) {
    document.documentElement.classList.add('dark')
  }

  // Create dark mode toggle if it doesn't exist
  if (!document.getElementById('dark-mode-toggle')) {
    const toggle = document.createElement('button')
    toggle.id = 'dark-mode-toggle'
    toggle.className = 'dark-mode-toggle'
    toggle.setAttribute('aria-label', 'Toggle dark mode')

    // Add icon based on current mode
    toggle.innerHTML = prefersDark
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'

    // Add to the document
    const header = document.querySelector('.header')
    if (header) {
      header.appendChild(toggle)
    }

    // Add toggle functionality
    toggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark')

      // Update icon
      if (document.documentElement.classList.contains('dark')) {
        toggle.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
      } else {
        toggle.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'
      }
    })
  }

  // Add password visibility toggle
  const passwordInputs = document.querySelectorAll('input[type="password"]')
  passwordInputs.forEach((input) => {
    const wrapper = document.createElement('div')
    wrapper.className = 'password-wrapper'

    // Insert wrapper before input
    input.parentNode.insertBefore(wrapper, input)

    // Move input into wrapper
    wrapper.appendChild(input)

    // Create toggle button
    const toggleBtn = document.createElement('button')
    toggleBtn.type = 'button'
    toggleBtn.className = 'password-toggle'
    toggleBtn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>'
    toggleBtn.setAttribute('aria-label', 'Toggle password visibility')

    wrapper.appendChild(toggleBtn)

    // Add toggle functionality
    toggleBtn.addEventListener('click', () => {
      if (input.type === 'password') {
        input.type = 'text'
        toggleBtn.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'
      } else {
        input.type = 'password'
        toggleBtn.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>'
      }
    })
  })

  // Adiciona animação de fade-in aos elementos
  const loginCard = document.querySelector('.card-pf')
  if (loginCard) {
    loginCard.style.opacity = '0'
    loginCard.style.transform = 'translateY(20px)'
    loginCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease'

    setTimeout(() => {
      loginCard.style.opacity = '1'
      loginCard.style.transform = 'translateY(0)'
    }, 100)
  }

  // Melhora a acessibilidade dos campos de formulário
  const inputs = document.querySelectorAll('input')
  inputs.forEach((input) => {
    input.addEventListener('focus', function () {
      this.parentElement.classList.add('input-focused')
    })

    input.addEventListener('blur', function () {
      this.parentElement.classList.remove('input-focused')
    })
  })
})
