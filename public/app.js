const courseGrid = document.querySelector("#course-grid");
const searchInput = document.querySelector("#course-search");
const dialog = document.querySelector("#course-dialog");
const authDialog = document.querySelector("#auth-dialog");
const toast = document.querySelector("#toast");
const icons = { "Lập trình": "⌘", "Thiết kế": "✳", "Dữ liệu": "▦" };
let courses = [];
let activeFilter = "all";
let selectedCourseId = null;
let selectedLessonId = null;
let readingCourseId = null;
let readRequestInFlight = false;
let toastTimeout;
let currentStudent = null;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers }
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Không thể hoàn thành yêu cầu.");
  return result;
}

function showToast(message, isError = false) {
  toast.textContent = message;
  toast.classList.toggle("toast-error", isError);
  toast.classList.add("visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("visible"), 3200);
}

function courseProgress(course) {
  return course.lesson_count ? Math.round((course.completed_count / course.lesson_count) * 100) : 0;
}

function isCourseCompleted(course) {
  return Boolean(course.lesson_count) && Number(course.completed_count) >= Number(course.lesson_count);
}

function renderCourses() {
  const search = searchInput.value.trim().toLocaleLowerCase("vi");
  const visibleCourses = courses.filter((course) => {
    const matchesFilter = activeFilter === "all"
      || (activeFilter === "enrolled" ? course.is_enrolled : course.category === activeFilter);
    const matchesSearch = `${course.title} ${course.category} ${course.instructor}`.toLocaleLowerCase("vi").includes(search);
    return matchesFilter && matchesSearch;
  });
  courseGrid.replaceChildren();

  if (!visibleCourses.length) {
    const message = activeFilter === "enrolled" && !currentStudent
      ? "Đăng nhập để xem các khóa học bạn đã đăng ký."
      : search ? "Không tìm thấy khóa học phù hợp." : "Chưa có khóa học trong danh mục này.";
    courseGrid.append(element("div", "empty-state", message));
    return;
  }

  visibleCourses.forEach((course, index) => {
    const card = element("article", `course-card accent-${course.accent}`);
    const artwork = element("div", "course-art");
    const artIcon = element("span", "course-art-icon", icons[course.category] || "✦");
    const artLabel = element("span", "course-art-label", course.category.toUpperCase());
    const artShape = element("span", "course-art-shape", "✳");
    artwork.append(artIcon, artLabel, artShape);
    const body = element("div", "course-body");
    const details = element("div", "course-kicker");
    details.append(element("span", "category-name", course.category), element("span", "course-level", course.level));
    const title = element("h3", "course-title", course.title);
    const instructor = element("p", "course-instructor", `Giảng viên ${course.instructor}`);
    const meta = element("div", "course-meta");
    meta.append(element("span", "", `▤  ${course.lesson_count} bài học`), element("span", "", `◷  ${course.duration_hours} giờ`));
    const progressWrap = element("div", "course-progress");
    const progressCaption = element("div", "progress-caption");
    progressCaption.append(element("span", "", course.is_enrolled ? "Tiến độ của bạn" : "Sẵn sàng bắt đầu"), element("strong", "", `${courseProgress(course)}%`));
    const progressTrack = element("div", "progress-track");
    const progressStep = Math.round(courseProgress(course) / 5) * 5;
    const progressValue = element("span", `progress-value progress-${progressStep}`);
    progressTrack.append(progressValue);
    progressWrap.append(progressCaption, progressTrack);
    const button = element("button", course.is_enrolled ? "course-action is-enrolled" : "course-action");
    button.type = "button";
    const buttonMain = element("span", "course-action-main", course.is_enrolled ? (isCourseCompleted(course) ? "Vào học" : "Tiếp tục học") : "Xem khóa học");
    const statusBadge = element("span", "course-status-badge", "Đã học");
    statusBadge.hidden = !isCourseCompleted(course);
    button.append(buttonMain, element("span", "course-action-arrow", "→"), statusBadge);
    button.addEventListener("click", () => openCourse(course.id));
    body.append(details, title, instructor, meta, progressWrap, button);
    card.append(artwork, body);
    courseGrid.append(card);
  });
}

async function loadDashboard() {
  const [auth, courseData] = await Promise.all([api("/api/auth/me"), api("/api/courses")]);
  currentStudent = auth.authenticated ? auth.student : null;
  courses = courseData;
  document.querySelector("#guest-actions").hidden = Boolean(currentStudent);
  document.querySelector("#signed-in-actions").hidden = !currentStudent;
  document.querySelector("#hoc-vien").hidden = !currentStudent;
  const fullName = currentStudent?.full_name || "người học";
  const initials = currentStudent
    ? fullName.split(/\s+/).slice(-2).map((part) => part[0]).join("").toUpperCase()
    : "HV";
  document.querySelector("#profile-name").textContent = fullName;
  document.querySelector("#profile-id").textContent = currentStudent?.student_code || "Học viên";
  document.querySelector("#avatar-initials").textContent = initials;
  document.querySelector("#welcome-name").textContent = currentStudent ? fullName.split(/\s+/).at(-1) : fullName;
  document.querySelector("#stat-enrolled").textContent = currentStudent?.enrolled_courses || 0;
  document.querySelector("#stat-completed").textContent = currentStudent?.completed_lessons || 0;
  document.querySelector("#stat-available").textContent = courses.length;
  if (currentStudent) {
    document.querySelector("#student-avatar").textContent = initials;
    document.querySelector("#student-name").textContent = fullName;
    document.querySelector("#student-email").textContent = currentStudent.email;
    document.querySelector("#student-code").textContent = currentStudent.student_code || "Chưa cập nhật";
    document.querySelector("#student-enrolled").textContent = currentStudent.enrolled_courses;
    document.querySelector("#student-completed").textContent = currentStudent.completed_lessons;
  }
  document.querySelector("#today-label").textContent = new Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  renderCourses();
}

function setAuthMode(mode) {
  const registering = mode === "register";
  document.querySelector("#login-form").hidden = registering;
  document.querySelector("#register-form").hidden = !registering;
  document.querySelector("#auth-title").textContent = registering ? "Tạo tài khoản học viên" : "Chào mừng bạn";
  document.querySelector("#auth-message").textContent = "";
  document.querySelectorAll("[data-auth-tab]").forEach((tab) => {
    const selected = tab.dataset.authTab === mode;
    tab.classList.toggle("selected", selected);
    tab.setAttribute("aria-selected", String(selected));
  });
}

function showAuthDialog(mode = "login") {
  setAuthMode(mode);
  if (dialog.open) dialog.close();
  if (!authDialog.open) authDialog.showModal();
}

async function openCourse(courseId) {
  try {
    const course = await api(`/api/courses/${encodeURIComponent(courseId)}`);
    selectedCourseId = course.id;
    document.querySelector("#dialog-category").textContent = `${course.category}  ·  ${course.level}`;
    document.querySelector("#dialog-title").textContent = course.title;
    document.querySelector("#dialog-description").textContent = course.description;
    document.querySelector("#dialog-meta").textContent = `Giảng viên ${course.instructor}  ·  ${course.duration_hours} giờ`;
    document.querySelector("#lesson-count").textContent = `${course.lessons.length} bài học`;
    document.querySelector("#dialog-progress").textContent = course.is_enrolled
      ? `${course.lessons.filter((lesson) => lesson.completed).length}/${course.lessons.length} bài đã hoàn thành`
      : "Đăng ký để lưu tiến độ học tập";
    const lessonList = document.querySelector("#lesson-list");
    lessonList.replaceChildren();
    course.lessons.forEach((lesson, index) => {
      const row = element("li", lesson.completed ? "lesson-row is-complete" : "lesson-row");
      const number = element("span", "lesson-number", lesson.completed ? "✓" : String(index + 1).padStart(2, "0"));
      const title = element("span", "lesson-title", lesson.title);
      const duration = element("span", "lesson-duration", `${lesson.duration_minutes} phút`);
      row.append(number, title, duration);
      if (course.is_enrolled) {
        const lessonButton = element("button", "lesson-open", "Vào học");
        lessonButton.type = "button";
        lessonButton.classList.toggle("is-complete", Boolean(lesson.completed));
        lessonButton.setAttribute("aria-label", `Vào học: ${lesson.title}`);
        lessonButton.addEventListener("click", () => openLesson(lesson.id, course.title));
        row.append(lessonButton);
      } else {
        const lessonButton = element("button", "lesson-open", "Đăng ký để học");
        lessonButton.type = "button";
        lessonButton.disabled = true;
        row.append(lessonButton);
      }
      lessonList.append(row);
    });
    document.querySelector("#course-overview").hidden = false;
    document.querySelector("#lesson-reader").hidden = true;
    const enrollButton = document.querySelector("#enroll-button");
    enrollButton.hidden = course.is_enrolled;
    enrollButton.disabled = false;
    enrollButton.textContent = currentStudent ? "Đăng ký khóa học →" : "Đăng nhập để đăng ký →";
    document.querySelector("#dialog-message").textContent = "";
    dialog.showModal();
  } catch (error) {
    showToast(error.message, true);
  }
}

async function enroll() {
  if (!selectedCourseId) return;
  if (!currentStudent) {
    showAuthDialog("login");
    return;
  }
  const button = document.querySelector("#enroll-button");
  button.disabled = true;
  try {
    await api(`/api/courses/${encodeURIComponent(selectedCourseId)}/enroll`, { method: "POST" });
    await loadDashboard();
    showToast("Đăng ký thành công. Chúc bạn học tập vui vẻ!");
    await openCourse(selectedCourseId);
  } catch (error) {
    button.disabled = false;
    showToast(error.message, true);
  }
}

async function openLesson(lessonId, courseTitle) {
  try {
    const lesson = await api(`/api/lessons/${encodeURIComponent(lessonId)}`);
    selectedLessonId = lesson.id;
    readingCourseId = selectedCourseId;
    document.querySelector("#course-overview").hidden = true;
    document.querySelector("#lesson-reader").hidden = false;
    document.querySelector("#reader-course").textContent = courseTitle;
    document.querySelector("#reader-title").textContent = lesson.title;
    document.querySelector("#reader-meta").textContent = `${lesson.duration_minutes} phút đọc`;
    const content = document.querySelector("#reader-content");
    content.replaceChildren();
    content.scrollTop = 0;
    content.onscroll = null;
    readRequestInFlight = false;
    content.append(element("p", "reader-introduction", lesson.content.introduction));
    lesson.content.sections.forEach((section) => {
      const sectionElement = element("section", "reader-section");
      sectionElement.append(element("h3", "", section.heading));
      section.paragraphs.forEach((paragraph) => sectionElement.append(element("p", "", paragraph)));
      if (section.bullets?.length) {
        const list = element("ul", "reader-bullets");
        section.bullets.forEach((bullet) => list.append(element("li", "", bullet)));
        sectionElement.append(list);
      }
      content.append(sectionElement);
    });
    const completeButton = document.querySelector("#complete-reader-button");
    const status = document.querySelector("#reader-status");
    completeButton.disabled = true;
    completeButton.textContent = "Đọc hết nội dung để hoàn thành";
    if (lesson.completed) {
      completeButton.hidden = true;
      status.textContent = "Bạn đã hoàn thành bài học này.";
    } else {
      completeButton.hidden = false;
      status.textContent = lesson.is_read
        ? "Bạn đã đọc bài học này. Có thể đánh dấu hoàn thành."
        : "Đọc hết nội dung để mở nút hoàn thành.";
      if (lesson.is_read) {
        completeButton.disabled = false;
        completeButton.textContent = "Hoàn thành bài học";
      } else {
        content.onscroll = confirmLessonReadAtEnd;
        if (content.scrollHeight <= content.clientHeight + 8) {
          await confirmLessonReadAtEnd();
        }
      }
    }
    content.scrollTop = 0;
    document.querySelector("#course-dialog").scrollTop = 0;
  } catch (error) {
    showToast(error.message, true);
  }
}

async function confirmLessonReadAtEnd() {
  const content = document.querySelector("#reader-content");
  const reachedEnd = content.scrollTop + content.clientHeight >= content.scrollHeight - 16;
  if (!reachedEnd || readRequestInFlight || document.querySelector("#complete-reader-button").disabled === false) {
    return;
  }
  readRequestInFlight = true;
  try {
    await api(`/api/lessons/${encodeURIComponent(selectedLessonId)}/read`, { method: "POST" });
    document.querySelector("#complete-reader-button").disabled = false;
    document.querySelector("#complete-reader-button").textContent = "Hoàn thành bài học";
    document.querySelector("#reader-status").textContent = "Bạn đã đọc hết nội dung. Bây giờ có thể hoàn thành bài học.";
  } catch (error) {
    document.querySelector("#reader-status").textContent = error.message;
  } finally {
    readRequestInFlight = false;
  }
}

async function completeLesson() {
  if (!selectedLessonId || !readingCourseId) return;
  const button = document.querySelector("#complete-reader-button");
  button.disabled = true;
  try {
    await api(`/api/lessons/${encodeURIComponent(selectedLessonId)}/complete`, { method: "POST" });
    await loadDashboard();
    showToast("Đã cập nhật tiến độ học tập.");
    if (dialog.open) {
      await openCourse(readingCourseId);
    }
  } catch (error) {
    button.disabled = false;
    showToast(error.message, true);
  }
}

document.querySelectorAll(".filter-tab").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter-tab").forEach((tab) => tab.classList.toggle("selected", tab === button));
    renderCourses();
  });
});
document.querySelectorAll(".category-link").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.category;
    document.querySelectorAll(".filter-tab").forEach((tab) => tab.classList.toggle("selected", tab.dataset.filter === activeFilter));
    renderCourses();
    document.querySelector("#khoa-hoc").scrollIntoView({ behavior: "smooth" });
  });
});
document.querySelectorAll('[data-nav="courses"], [data-show-all], .bottom-banner a, .welcome-copy .primary-button').forEach((link) => {
  link.addEventListener("click", () => {
    activeFilter = "all";
    document.querySelectorAll(".filter-tab").forEach((tab) => tab.classList.toggle("selected", tab.dataset.filter === "all"));
    renderCourses();
  });
});
document.querySelector('[data-nav="my-courses"]').addEventListener("click", () => {
  if (!currentStudent) {
    showAuthDialog("login");
    return;
  }
  activeFilter = "enrolled";
  document.querySelectorAll(".filter-tab").forEach((tab) => tab.classList.toggle("selected", tab.dataset.filter === "enrolled"));
  renderCourses();
});
searchInput.addEventListener("input", renderCourses);
document.querySelector("#enroll-button").addEventListener("click", enroll);
document.querySelector("#complete-reader-button").addEventListener("click", completeLesson);
document.querySelector("#reader-back").addEventListener("click", () => {
  if (readingCourseId) openCourse(readingCourseId);
});
document.querySelector("#reader-close").addEventListener("click", () => dialog.close());
document.querySelector("#profile-button").addEventListener("click", () => {
  document.querySelector("#hoc-vien").scrollIntoView({ behavior: "smooth" });
});
document.querySelector('[data-nav="student"]').addEventListener("click", (event) => {
  event.preventDefault();
  if (!currentStudent) {
    showAuthDialog("login");
    return;
  }
  document.querySelector("#hoc-vien").scrollIntoView({ behavior: "smooth" });
});
document.querySelectorAll("[data-auth-open]").forEach((button) => {
  button.addEventListener("click", () => showAuthDialog(button.dataset.authOpen));
});
document.querySelectorAll("[data-auth-tab]").forEach((button) => {
  button.addEventListener("click", () => setAuthMode(button.dataset.authTab));
});
document.querySelector("#login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitAuthForm(event.currentTarget, "/api/auth/login");
});
document.querySelector("#register-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  if (data.get("password") !== data.get("password_confirm")) {
    document.querySelector("#auth-message").textContent = "Mật khẩu xác nhận không khớp.";
    return;
  }
  await submitAuthForm(form, "/api/auth/register");
});
async function submitAuthForm(form, endpoint) {
  const button = form.querySelector('button[type="submit"]');
  const message = document.querySelector("#auth-message");
  const data = Object.fromEntries(new FormData(form));
  delete data.password_confirm;
  button.disabled = true;
  message.textContent = "";
  try {
    const result = await api(endpoint, { method: "POST", body: JSON.stringify(data) });
    currentStudent = result.student;
    form.reset();
    authDialog.close();
    await loadDashboard();
    showToast(endpoint.endsWith("register") ? "Tạo tài khoản thành công. Chào mừng bạn!" : "Đăng nhập thành công.");
    if (selectedCourseId) await openCourse(selectedCourseId);
  } catch (error) {
    message.textContent = error.message;
  } finally {
    button.disabled = false;
  }
}
document.querySelector("#logout-button").addEventListener("click", async () => {
  try {
    await api("/api/auth/logout", { method: "POST" });
    currentStudent = null;
    activeFilter = "all";
    document.querySelectorAll(".filter-tab").forEach((tab) => tab.classList.toggle("selected", tab.dataset.filter === "all"));
    await loadDashboard();
    showToast("Bạn đã đăng xuất.");
  } catch (error) {
    showToast(error.message, true);
  }
});
document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
document.querySelector("#auth-close").addEventListener("click", () => authDialog.close());
authDialog.addEventListener("click", (event) => {
  if (event.target === authDialog) authDialog.close();
});

loadDashboard().catch((error) => {
  courseGrid.replaceChildren(element("div", "error-state", `Không tải được dữ liệu: ${error.message}. Hãy kiểm tra kết nối và thử tải lại trang.`));
});
