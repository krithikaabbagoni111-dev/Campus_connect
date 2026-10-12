document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  // Current date label
  const todayLabel = $("#todayLabel");
  if (todayLabel) {
    todayLabel.textContent = new Intl.DateTimeFormat("en-IN", {
      weekday: "short", day: "2-digit", month: "short"
    }).format(new Date()).toUpperCase() + " · CAMPUS EDITION";
  }

  // Mobile navigation
  const menuToggle = $("#menuToggle");
  const sidebar = $("#sidebar");
  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      const open = sidebar.classList.toggle("sidebar-open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.textContent = open ? "×" : "☰";
    });
  }

  // Dismissible flash messages
  $$(".flash-close").forEach(button => {
    button.addEventListener("click", () => button.closest(".flash-message")?.remove());
  });

  // Confirm destructive form submissions
  $$(".delete-form").forEach(form => {
    form.addEventListener("submit", event => {
      const message = form.dataset.confirm || "Are you sure?";
      if (!window.confirm(message)) event.preventDefault();
    });
  });

  // Event search and category filters
  const eventSearch = $("#eventSearch");
  const eventCards = $$(".event-card");
  const filterButtons = $$(".filter-chip");
  const noResults = $("#noResults");
  const resultCount = $("#resultCount");
  let activeCategory = "All";

  function filterEvents() {
    const query = (eventSearch?.value || "").trim().toLowerCase();
    let visible = 0;
    eventCards.forEach(card => {
      const categoryMatch = activeCategory === "All" || card.dataset.category === activeCategory;
      const searchMatch = (card.dataset.search || "").includes(query);
      const show = categoryMatch && searchMatch;
      card.hidden = !show;
      if (show) visible++;
    });
    if (noResults) noResults.hidden = visible > 0;
    if (resultCount) resultCount.textContent = `${visible} event${visible === 1 ? "" : "s"}`;
  }

  eventSearch?.addEventListener("input", filterEvents);
  filterButtons.forEach(button => button.addEventListener("click", () => {
    activeCategory = button.dataset.filter || "All";
    filterButtons.forEach(item => item.classList.toggle("selected", item === button));
    filterEvents();
  }));

  const filterToggle = $("#filterToggle");
  const filterRow = $("#filterRow");
  filterToggle?.addEventListener("click", () => {
    const expanded = filterRow?.classList.toggle("filters-expanded") || false;
    filterToggle.setAttribute("aria-expanded", String(expanded));
    filterToggle.querySelector("span").textContent = expanded ? "−" : "＋";
  });

  // Registration modal
  const modalBackdrop = $("#modalBackdrop");
  const registrationForm = $("#registrationForm");
  const modalEventName = $("#modalEventName");
  const modalClose = $("#modalClose");
  let lastFocus = null;

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.hidden = true;
    document.body.classList.remove("modal-open");
    lastFocus?.focus();
  }

  $$(".register-trigger").forEach(button => button.addEventListener("click", () => {
    if (!modalBackdrop || !registrationForm) return;
    lastFocus = button;
    registrationForm.action = `/events/${button.dataset.eventId}/register`;
    if (modalEventName) modalEventName.textContent = button.dataset.eventTitle || "Campus event";
    modalBackdrop.hidden = false;
    document.body.classList.add("modal-open");
    $("input[name='full_name']", registrationForm)?.focus();
  }));

  modalClose?.addEventListener("click", closeModal);
  modalBackdrop?.addEventListener("click", event => {
    if (event.target === modalBackdrop) closeModal();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modalBackdrop && !modalBackdrop.hidden) closeModal();
  });

  // Registration ledger search
  const ledgerSearch = $("#ledgerSearch");
  const registrationRows = $$("#registrationTable tbody tr[data-search]");
  const ledgerCount = $("#ledgerCount");
  ledgerSearch?.addEventListener("input", () => {
    const query = ledgerSearch.value.trim().toLowerCase();
    let visible = 0;
    registrationRows.forEach(row => {
      const show = (row.dataset.search || "").includes(query);
      row.hidden = !show;
      if (show) visible++;
    });
    if (ledgerCount) ledgerCount.textContent = `${visible} record${visible === 1 ? "" : "s"}`;
  });

  // Set minimum date for new events to today
  const eventDate = $("#eventDate");
  if (eventDate) {
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString().slice(0, 10);
    eventDate.min = localDate;
  }

  // Gentle reveal animation for cards
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    $$(".event-card, .stat-card, .report-card").forEach(card => {
      card.classList.add("reveal");
      observer.observe(card);
    });
  }
});
