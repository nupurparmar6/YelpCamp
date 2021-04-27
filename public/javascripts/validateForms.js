
      //JavaScript for disabling form submissions if there are invalid fields
      (function() {
        'use strict'
        window.addEventListener('load', function() {
  
          // Fetch all the forms we want to apply custom Bootstrap validation styles to
          const forms = document.getElementsByClassName('needs-validation');
  
          // Loop over them and prevent submission
          //Array.from will make an array out of whatever is returned from getElementsByClassName(html collection etc)
          const validation = Array.from(forms, function(form){
            
              form.addEventListener('submit', function(event){
              if (!form.checkValidity()){
                event.preventDefault();
                event.stopPropagation();
              }
              form.classList.add('was-validated');
            }, false);
  
          });
        }, false);
      })()
 