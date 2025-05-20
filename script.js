document.addEventListener("DOMContentLoaded", () => {
  console.log("connected!");

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
      console.log(`Bar ${idx + 1} → level:`, level);  // 확인용
      if (level) {
        bar.style.width = level;
        //bar.style.backgroundColor = 'blue'; // 확인용 색상
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

  // ✅ work experience
  document.querySelectorAll(".company-btn").forEach(button => {
    button.addEventListener("click", () => {
      // 버튼 강조
      document.querySelectorAll(".company-btn").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
  
      // 회사 설명 표시
      const company = button.dataset.company;
      document.querySelectorAll(".company-info").forEach(info => {
        info.style.display = "none";
      });
      document.getElementById(company).style.display = "block";
    });
  });
  

  // ✅ 프로젝트 슬라이더
  document.querySelectorAll(".slider").forEach((slider, sliderIndex) => {
    const slides = slider.querySelectorAll(".slide");
    const prevBtn = slider.querySelector(".prev");
    const nextBtn = slider.querySelector(".next");

    let currentIndex = 0;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.remove("active");
      });
      slides[index].classList.add("active");
    };

    prevBtn.addEventListener("click", () => {
      console.log("prev click");
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    });

    nextBtn.addEventListener("click", () => {
      console.log("next click");
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    });

    showSlide(currentIndex);
  });

  // ✅ 프로젝트 참여율 애니메이션
const projectSection = document.querySelector("#projects");
const projectBars = document.querySelectorAll(".contributions .bar-fill");
let projectAnimated = false;

const animateProjectBars = () => {
  if (projectAnimated) return;
  projectBars.forEach(bar => {
    const level = bar.getAttribute("data-level"); // ← 여기서 값 읽고
    bar.style.width = "0%"; // 초기화
    setTimeout(() => {
      bar.style.width = level; // 애니메이션으로 채우기
    }, 50);
  });
  projectAnimated = true;
};

const projectObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateProjectBars();
    }
  });
}, { threshold: 0.3 });
// ✅ 이 부분만 rAF로 감싸면 완벽
if (projectSection) {
  requestAnimationFrame(() => {
    projectObserver.observe(projectSection);
  });

  // ✅ 추가 보조: scroll 이벤트로도 강제 실행
  window.addEventListener("scroll", () => {
    if (projectAnimated) return;
    const rect = projectSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.7) {
      animateProjectBars();
    }
  });
}

// ✅ 서브 프로젝트 토글 버튼
document.querySelectorAll(".sub-toggle-button").forEach(button => {
  button.addEventListener("click", () => {
    const detail = button.nextElementSibling;

    detail.classList.toggle("show");

    button.textContent = detail.classList.contains("show") 
      ? "상세내용 닫기"
      : "상세내용 보기";
  });
});


  // ✅ contact-form 전송 (반드시 DOMContentLoaded 안에 있어야 작동)
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
