(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation')

  // Loop over the forms and apply custom validation logic
  forms.forEach(form => {
    form.addEventListener('submit', event => {
      // If form is not valid, prevent submission and apply 'was-validated' class
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      // Apply Bootstrap's 'was-validated' class to the form
      form.classList.add('was-validated')
    }, false)
  })
})()