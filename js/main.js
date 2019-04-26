const toggler = document.querySelector(".toggler");
const nav = document.querySelector(".nav__list");

// click: toggle toggler & nav__list on mobile
toggler.addEventListener("click", function() {
  this.classList.toggle("toggler--active");
  nav.classList.toggle("nav__list--active");
});

// click: nav__link hiding menu on mobile
nav.addEventListener("click", function(e) {
  if (e.target.classList.contains("nav__link")) {
    toggler.classList.remove("toggler--active");
    nav.classList.remove("nav__list--active");
  }
});

const section = document.querySelectorAll(".scroll");
const sections = {};
// get sections offsetTop after all images are loaded / resize screen
window.onload = function() {
  section.forEach(function(e) {
    sections[e.id] = e.offsetTop;
  });
};
window.addEventListener("resize", function() {
  section.forEach(function(e) {
    sections[e.id] = e.offsetTop;
  });
});

let scrollPos;
window.addEventListener("scroll", function() {
  // scroll: show/hide nav depending on scroll direction
  if (document.body.getBoundingClientRect().top > scrollPos) {
    document.querySelector(".nav").removeAttribute("style");
  } else {
    if (
      !nav.classList.contains("nav__list--active") &&
      window.innerWidth < 768
    ) {
      document.querySelector(".nav").style.transform = "translateY(-100%)";
    }
  }
  scrollPos = document.body.getBoundingClientRect().top;

  // scroll: add active class / and delete others classes
  // to nav__link and section-title depending on scroll position
  for (let i in sections) {
    if (sections[i] - 200 <= this.scrollY) {
      document.querySelectorAll(".nav__link").forEach(function(link) {
        link.classList.remove("nav__link--active");
      });
      document.querySelectorAll(".section-title").forEach(function(link) {
        link.classList.remove("section-title--active");
      });
      document
        .querySelector(`[data-link="${i}"]`)
        .classList.add("nav__link--active");
      // check is data ref exist, because there is no section-title with data-ref="home"
      if (document.querySelector(`[data-ref="${i}"]`) !== null) {
        document
          .querySelector(`[data-ref="${i}"]`)
          .classList.add("section-title--active");
      }
    }
  }
});

const name = document.getElementById("name");
name.addEventListener("blur", validateName);
const email = document.getElementById("email");
email.addEventListener("blur", validateEmail);
const message = document.getElementById("message");
message.addEventListener("blur", validateMessage);

function validateName() {
  const re = /^[a-zA-Z]{3,10}$/;

  if (name.value.length === 0) {
    addError(" - Name Field is required", name);
  } else if (!re.test(name.value)) {
    addError(" - Min. 3 / Max. 10 characters", name);
  } else {
    clearError(name);
  }
}

function validateEmail() {
  const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,10})$/;

  if (email.value.length === 0) {
    addError(" - Email Field is required", email);
  } else if (!re.test(email.value)) {
    addError(" - Invalid email format", email);
  } else {
    clearError(email);
  }
}
function validateMessage() {
  if (message.value == 0) {
    addError(" - Message Field is required", message);
  } else if (message.value.length < 30) {
    addError(" - Min. 30 characters", message);
  } else {
    clearError(message);
  }
}

function addError(text, formField) {
  formField.nextElementSibling.textContent = text;
  formField.classList.add("form__field--invalid");
}
function clearError(formField) {
  formField.nextElementSibling.textContent = "";
  formField.classList.remove("form__field--invalid");
}

const form = document.getElementById("contact-form");

form.addEventListener("submit", e => {
  e.preventDefault();

  // Check validation field
  validateName();
  validateEmail();
  validateMessage();

  if (
    Array.from(document.querySelectorAll(".form__field-error")).every(
      field => field.textContent === ""
    )
  ) {
    alert("Message sent!");
    document
      .querySelectorAll(".form__field")
      .forEach(field => (field.value = ""));
  }
});
