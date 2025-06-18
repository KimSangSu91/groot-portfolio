document.addEventListener("DOMContentLoaded", () => {
  console.log("connected!");
  new Typed("#typing-text", {
    strings: ["만나서 반갑습니다.", "기획자 김상수입니다."],
    typeSpeed: 50,        // 입력 속도
    backSpeed: 30,        // 지우는 속도
    backDelay: 1500,      // 입력 후 기다리는 시간
    startDelay: 500,      // 시작 전 기다리는 시간 (선택)
    loop: true,           // 반복
    showCursor: true      // 커서 보이게
  });


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


  // ✅ 프로젝트 슬라이더 (슬라이드 + 인디케이터 동기화)
  document.querySelectorAll(".slider").forEach((slider) => {
    const slides = slider.querySelectorAll(".slide");
    const prevBtn = slider.querySelector(".prev");
    const nextBtn = slider.querySelector(".next");
    const dots = slider.querySelectorAll(".slider-controls .dot");

    let currentIndex = 0;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });

      currentIndex = index;
    };

    prevBtn?.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    });

    nextBtn?.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    });

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        showSlide(i);
      });
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

    // 갤러리 슬라이드 (기본 3장 보기 기준)
    const track = document.querySelector(".gallery-track");
    const cards = document.querySelectorAll(".gallery-card");
    const prevBtn = document.querySelector(".gallery-prev");
    const nextBtn = document.querySelector(".gallery-next");

    const visibleCount = 3;
    let currentIndex = 0;

    const updateGallery = () => {
      const cardWidth = cards[0].offsetWidth + 20;
      // 최대 이동 인덱스를 카드 전체 - 보여지는 수로 보정
      const maxIndex = cards.length - visibleCount;
      if (currentIndex < 0) currentIndex = maxIndex;
      if (currentIndex > maxIndex) currentIndex = 0;

      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    };

    prevBtn.addEventListener("click", () => {
      currentIndex--;
      updateGallery();
    });

    nextBtn.addEventListener("click", () => {
      currentIndex++;
      updateGallery();
    });

    // ✅ 자동 전환
    setInterval(() => {
      currentIndex++;
      updateGallery();
    }, 3000);

    // ✅ 드래그 이동
    let isDragging = false;
    let startX = 0;

    track.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.pageX;
      track.classList.add("dragging");
    });

    document.addEventListener("mouseup", (e) => {
      if (!isDragging) return;
      const diff = e.pageX - startX;

      if (diff > 50) {
        currentIndex--;
      } else if (diff < -50) {
        currentIndex++;
      }

      updateGallery();
      isDragging = false;
      track.classList.remove("dragging"); // 
    });

    // 맨 위로 버튼 기능
    const scrollTopBtn = document.getElementById("scrollToTopBtn");

    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        scrollTopBtn.style.display = "block";
      } else {
        scrollTopBtn.style.display = "none";
      }
    });

    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    // script.js (이미 연결된 경우 여기에 추가)
    const toggleBtn = document.getElementById("dark-mode-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        const icon = toggleBtn.querySelector("i");
        icon.classList.toggle("fa-moon");
        icon.classList.toggle("fa-sun");
      });
    }

    const header = document.querySelector(".main-header");

    window.addEventListener("scroll", () => {
      console.log("스크롤 감지됨! Y값:", window.scrollY);
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });

    // ✅ 목차 활성화 표시
    const sectionEls = document.querySelectorAll("main section[id]");
    const tocLinks = document.querySelectorAll(".toc a");

    const tocObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log("보이는 섹션:", entry.target.id); // ✅ 이 줄만 추가
            tocLinks.forEach((link) => {
              link.classList.remove("active");
              const targetId = entry.target.getAttribute("id");
              if (link.getAttribute("href") === `#${targetId}`) {
                link.classList.add("active");
              }
            });
          }
        });
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0.2,
      }
    );

    sectionEls.forEach((section) => {
      tocObserver.observe(section);
    });



    // 이 위에 추가
  }
}); 
