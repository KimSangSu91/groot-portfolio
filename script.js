document.addEventListener("DOMContentLoaded", () => {
  // 카드 애니메이션
  const cards = document.querySelectorAll('.card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(card => observer.observe(card));

  // 숙련도 그래프 애니메이션
  const skillSection = document.querySelector(".skills-section");
  const bars = document.querySelectorAll(".bar.fill");
  let animated = false;

  const animateSkillBars = () => {
    if (animated) return;
    bars.forEach((bar, idx) => {
      const level = bar.getAttribute("data-level");
      console.log(`Bar ${idx + 1} → level:`, level);  // ✅ 콘솔 확인용
      if (level) {
        bar.style.width = level;
        bar.style.backgroundColor = 'red';  // ✅ 확인용 색상
      }
    });
    animated = true;
  };

  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkillBars();
      }
    });
  }, { threshold: 0.3 });

  if (skillSection) {
    skillObserver.observe(skillSection);
  }

  // contact-form 전송 처리
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = new FormData(contactForm);
      fetch("https://script.google.com/macros/s/🟦배포URL🟦/exec", {
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
