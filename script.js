document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.card');
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, {
      threshold: 0.1
    });
  
    cards.forEach(card => observer.observe(card));
  
    // ✅ contact-form 이벤트 등록
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
  
        const data = new FormData(contactForm);
  
        fetch("https://script.google.com/macros/s/AKfycbwUzqF5IIlPxOG7t0WUkLPYKfdcVfNQKHEt29sLvdcYBaZxQNoi0Tz8AkmH7bW4pOFN6w/exec", {
            method: "POST",
            body: data
          })
          .then(res => res.text())
          .then(result => {
            if (result === "success") {
              alert("메시지가 전송되었습니다!");
              contactForm.reset();
            } else {
              alert("전송에 실패했습니다.");
            }
          })
          .catch(err => {
            alert("오류가 발생했습니다.");
            console.error(err);
          });
      });
    }
  });
  