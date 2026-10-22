const path = require("node:path");
const crypto = require("node:crypto");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");
const client = require("prom-client");
const lessonContent = require("./lesson-content");
const { log } = require("./logger");

const port = Number(process.env.PORT || 3000);
const sessionCookie = "el_session";
const sessionLifetimeMs = 7 * 24 * 60 * 60 * 1000;
const cookieSecure = process.env.COOKIE_SECURE === "true";
const dummyPasswordHash = bcrypt.hash("__invalid_account_login__", 12);
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME || "elearning",
  user: process.env.DB_USER || "elearning",
  password: process.env.DB_PASSWORD,
  charset: "utf8mb4",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const registry = new client.Registry();
client.collectDefaultMetrics({ register: registry });
const requestCount = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests served by the e-learning application",
  labelNames: ["method", "route", "status"],
  registers: [registry]
});
const requestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
  registers: [registry]
});

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'none'"]
    }
  }
}));
app.use(express.json({ limit: "16kb" }));
app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({ error: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau." })
}));
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({ error: "Bạn đã thử quá nhiều lần. Vui lòng thử lại sau 15 phút." })
});
app.use("/api", (req, res, next) => {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    return next();
  }
  const origin = req.get("origin");
  if (!origin) {
    return res.status(403).json({ error: "Yêu cầu không hợp lệ. Hãy tải lại trang và thử lại." });
  }
  try {
    const expectedOrigin = new URL(`${req.protocol}://${req.get("host")}`).origin;
    if (new URL(origin).origin !== expectedOrigin) {
      return res.status(403).json({ error: "Yêu cầu không hợp lệ. Hãy tải lại trang và thử lại." });
    }
  } catch {
    return res.status(403).json({ error: "Yêu cầu không hợp lệ. Hãy tải lại trang và thử lại." });
  }
  next();
});
app.use(async (req, res, next) => {
  try {
    if (req.path === "/api/healthz") {
      return next();
    }
    const match = req.headers.cookie?.match(/(?:^|;\s*)el_session=([^;]+)/);
    if (!match) {
      return next();
    }
    let token;
    try {
      token = decodeURIComponent(match[1]);
    } catch {
      clearSessionCookie(res);
      return next();
    }
    if (!/^[A-Za-z0-9_-]{43}$/.test(token)) {
      res.clearCookie(sessionCookie, { httpOnly: true, secure: cookieSecure, sameSite: "lax", path: "/" });
      return next();
    }
    const sessionHash = crypto.createHash("sha256").update(token).digest("hex");
    const [rows] = await pool.query(
      `SELECT s.id, s.full_name, s.email, s.student_code
       FROM auth_sessions a
       JOIN students s ON s.id = a.student_id
       WHERE a.session_hash = ? AND a.expires_at > UTC_TIMESTAMP()`,
      [sessionHash]
    );
    if (rows.length) {
      req.student = rows[0];
      req.sessionHash = sessionHash;
    } else {
      res.clearCookie(sessionCookie, { httpOnly: true, secure: cookieSecure, sameSite: "lax", path: "/" });
    }
    next();
  } catch (error) {
    next(error);
  }
});
app.use((req, res, next) => {
  const startedAt = process.hrtime.bigint();
  const stopTimer = requestDuration.startTimer();
  res.on("finish", () => {
    const route = req.route ? `${req.baseUrl}${req.route.path}` : "not_found";
    requestCount.inc({ method: req.method, route, status: String(res.statusCode) });
    stopTimer({ method: req.method, route });
    if (req.path.startsWith("/api/") && req.path !== "/api/healthz") {
      log(res.statusCode >= 500 ? "error" : "info", "http_request", {
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration_ms: Number(process.hrtime.bigint() - startedAt) / 1e6
      });
    }
  });
  next();
});

app.get("/api/healthz", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    log("error", "health_check_failed", { error: error.message });
    res.status(503).json({ status: "unavailable", database: "disconnected" });
  }
});

app.get("/metrics", async (req, res, next) => {
  try {
    res.set("Content-Type", registry.contentType);
    res.end(await registry.metrics());
  } catch (error) {
    next(error);
  }
});

async function studentProfile(studentId) {
  const [rows] = await pool.query(
    `SELECT s.id, s.full_name, s.email, s.student_code,
            (SELECT COUNT(*) FROM enrollments WHERE student_id = s.id) AS enrolled_courses,
            (SELECT COUNT(*) FROM lesson_progress WHERE student_id = s.id) AS completed_lessons
     FROM students s
     WHERE s.id = ?`,
    [studentId]
  );
  return rows[0];
}

function requireStudent(req, res, next) {
  if (!req.student) {
    return res.status(401).json({ error: "Vui lòng đăng nhập để tiếp tục." });
  }
  next();
}

function setSessionCookie(res, token) {
  res.cookie(sessionCookie, token, {
    httpOnly: true,
    secure: cookieSecure,
    sameSite: "lax",
    path: "/",
    maxAge: sessionLifetimeMs
  });
}

function clearSessionCookie(res) {
  res.clearCookie(sessionCookie, {
    httpOnly: true,
    secure: cookieSecure,
    sameSite: "lax",
    path: "/"
  });
}

async function createSession(connection, studentId) {
  const token = crypto.randomBytes(32).toString("base64url");
  const sessionHash = crypto.createHash("sha256").update(token).digest("hex");
  await connection.query(
    "INSERT INTO auth_sessions (session_hash, student_id, expires_at) VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 7 DAY))",
    [sessionHash, studentId]
  );
  return token;
}

app.get("/api/auth/me", async (req, res, next) => {
  try {
    if (!req.student) {
      return res.json({ authenticated: false });
    }
    res.json({ authenticated: true, student: await studentProfile(req.student.id) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/register", authRateLimit, async (req, res, next) => {
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const fullName = typeof body.full_name === "string" ? body.full_name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const studentCode = typeof body.student_code === "string" ? body.student_code.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (fullName.length < 2 || fullName.length > 255) {
    return res.status(400).json({ error: "Họ tên phải có từ 2 đến 255 ký tự." });
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Vui lòng nhập địa chỉ email hợp lệ." });
  }
  if (studentCode && !/^[A-Za-z0-9._-]{4,50}$/.test(studentCode)) {
    return res.status(400).json({ error: "Mã học viên chỉ gồm 4–50 chữ cái, chữ số, dấu chấm, gạch dưới hoặc gạch nối." });
  }
  if (password.length < 10 || Buffer.byteLength(password, "utf8") > 72) {
    return res.status(400).json({ error: "Mật khẩu phải có ít nhất 10 ký tự và tối đa 72 byte." });
  }
  let connection;
  let transactionStarted = false;
  try {
    const studentId = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 12);
    connection = await pool.getConnection();
    await connection.beginTransaction();
    transactionStarted = true;
    await connection.query(
      "INSERT INTO students (id, full_name, email, password_hash, student_code) VALUES (?, ?, ?, ?, ?)",
      [studentId, fullName, email, passwordHash, studentCode || null]
    );
    const token = await createSession(connection, studentId);
    await connection.commit();
    transactionStarted = false;
    setSessionCookie(res, token);
    res.status(201).json({
      authenticated: true,
      student: {
        id: studentId,
        full_name: fullName,
        email,
        student_code: studentCode || null,
        enrolled_courses: 0,
        completed_lessons: 0
      }
    });
  } catch (error) {
    if (transactionStarted) {
      await connection.rollback();
    }
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email hoặc mã học viên đã được sử dụng." });
    }
    next(error);
  } finally {
    connection?.release();
  }
});

app.post("/api/auth/login", authRateLimit, async (req, res, next) => {
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password || password.length > 1024) {
    return res.status(401).json({ error: "Email hoặc mật khẩu không chính xác." });
  }
  try {
    const [rows] = await pool.query(
      "SELECT id, password_hash FROM students WHERE email = ?",
      [email]
    );
    const hash = rows[0]?.password_hash || await dummyPasswordHash;
    const passwordMatches = await bcrypt.compare(password, hash);
    if (!rows.length || !rows[0].password_hash || !passwordMatches) {
      return res.status(401).json({ error: "Email hoặc mật khẩu không chính xác." });
    }
    const token = await createSession(pool, rows[0].id);
    setSessionCookie(res, token);
    res.json({ authenticated: true, student: await studentProfile(rows[0].id) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/logout", async (req, res, next) => {
  try {
    if (req.sessionHash) {
      await pool.query("DELETE FROM auth_sessions WHERE session_hash = ?", [req.sessionHash]);
    }
    clearSessionCookie(res);
    res.json({ logged_out: true });
  } catch (error) {
    next(error);
  }
});

app.get("/api/profile", async (req, res, next) => {
  try {
    if (!req.student) {
      return res.status(401).json({ error: "Vui lòng đăng nhập để xem hồ sơ học viên." });
    }
    res.json(await studentProfile(req.student.id));
  } catch (error) {
    next(error);
  }
});

app.get("/api/courses", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.id, c.title, c.category, c.description, c.instructor,
              c.duration_hours, c.level, c.accent,
              COUNT(DISTINCT l.id) AS lesson_count,
              COUNT(DISTINCT lp.lesson_id) AS completed_count,
              (e.student_id IS NOT NULL) AS is_enrolled
       FROM courses c
       LEFT JOIN lessons l ON l.course_id = c.id
       LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.student_id = ?
       LEFT JOIN enrollments e ON e.course_id = c.id AND e.student_id = ?
       GROUP BY c.id, e.student_id
       ORDER BY c.title`,
      [req.student?.id || null, req.student?.id || null]
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.get("/api/courses/:courseId", async (req, res, next) => {
  try {
    const [courseRows] = await pool.query(
      `SELECT c.id, c.title, c.category, c.description, c.instructor,
              c.duration_hours, c.level, c.accent,
              (e.student_id IS NOT NULL) AS is_enrolled
       FROM courses c
       LEFT JOIN enrollments e ON e.course_id = c.id AND e.student_id = ?
       WHERE c.id = ?`,
      [req.student?.id || null, req.params.courseId]
    );
    if (!courseRows.length) {
      return res.status(404).json({ error: "Không tìm thấy khóa học." });
    }
    const [lessons] = await pool.query(
      `SELECT l.id, l.title, l.duration_minutes,
              (lp.lesson_id IS NOT NULL) AS completed,
              EXISTS (
                SELECT 1 FROM lesson_reads lr
                WHERE lr.lesson_id = l.id AND lr.student_id = ?
              ) AS is_read
       FROM lessons l
       LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.student_id = ?
       WHERE l.course_id = ?
       ORDER BY l.position`,
      [req.student?.id || null, req.student?.id || null, req.params.courseId]
    );
    res.json({ ...courseRows[0], lessons });
  } catch (error) {
    next(error);
  }
});

app.get("/api/lessons/:lessonId", requireStudent, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT l.id, l.title, l.duration_minutes, l.content,
              (e.student_id IS NOT NULL) AS is_enrolled,
              EXISTS (
                SELECT 1 FROM lesson_reads lr
                WHERE lr.lesson_id = l.id AND lr.student_id = ?
              ) AS is_read,
              EXISTS (
                SELECT 1 FROM lesson_progress lp
                WHERE lp.lesson_id = l.id AND lp.student_id = ?
              ) AS completed
       FROM lessons l
       LEFT JOIN enrollments e ON e.course_id = l.course_id AND e.student_id = ?
       WHERE l.id = ?`,
      [req.student.id, req.student.id, req.student.id, req.params.lessonId]
    );
    if (!rows.length) {
      return res.status(404).json({ error: "Không tìm thấy bài học." });
    }
    if (!rows[0].is_enrolled) {
      return res.status(403).json({ error: "Hãy đăng ký khóa học để xem nội dung bài học." });
    }
    if (!rows[0].content) {
      return res.status(503).json({ error: "Nội dung bài học chưa sẵn sàng. Vui lòng thử lại sau." });
    }
    const { content, ...lesson } = rows[0];
    res.json({ ...lesson, content: JSON.parse(content) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/courses/:courseId/enroll", requireStudent, async (req, res, next) => {
  try {
    const [courseRows] = await pool.query("SELECT id FROM courses WHERE id = ?", [req.params.courseId]);
    if (!courseRows.length) {
      return res.status(404).json({ error: "Không tìm thấy khóa học." });
    }
    await pool.query(
      "INSERT IGNORE INTO enrollments (student_id, course_id) VALUES (?, ?)",
      [req.student.id, req.params.courseId]
    );
    res.status(201).json({ enrolled: true });
  } catch (error) {
    next(error);
  }
});

app.post("/api/lessons/:lessonId/read", requireStudent, async (req, res, next) => {
  try {
    const [lessonRows] = await pool.query(
      `SELECT l.id, e.student_id
       FROM lessons l
       LEFT JOIN enrollments e ON e.course_id = l.course_id AND e.student_id = ?
       WHERE l.id = ?`,
      [req.student.id, req.params.lessonId]
    );
    if (!lessonRows.length) {
      return res.status(404).json({ error: "Không tìm thấy bài học." });
    }
    if (!lessonRows[0].student_id) {
      return res.status(403).json({ error: "Hãy đăng ký khóa học để xem nội dung bài học." });
    }
    await pool.query(
      "INSERT IGNORE INTO lesson_reads (student_id, lesson_id) VALUES (?, ?)",
      [req.student.id, req.params.lessonId]
    );
    res.json({ read: true });
  } catch (error) {
    next(error);
  }
});

app.post("/api/lessons/:lessonId/complete", requireStudent, async (req, res, next) => {
  try {
    const [lessonRows] = await pool.query(
      `SELECT l.id, e.student_id,
              lr.lesson_id AS read_lesson_id
       FROM lessons l
       LEFT JOIN enrollments e ON e.course_id = l.course_id AND e.student_id = ?
       LEFT JOIN lesson_reads lr ON lr.lesson_id = l.id AND lr.student_id = ?
       WHERE l.id = ?`,
      [req.student.id, req.student.id, req.params.lessonId]
    );
    if (!lessonRows.length) {
      return res.status(404).json({ error: "Không tìm thấy bài học." });
    }
    if (!lessonRows[0].student_id) {
      return res.status(403).json({ error: "Hãy đăng ký khóa học trước khi hoàn thành bài học." });
    }
    if (!lessonRows[0].read_lesson_id) {
      return res.status(403).json({ error: "Hãy mở bài học và đọc hết nội dung trước khi đánh dấu hoàn thành." });
    }
    await pool.query(
      "INSERT IGNORE INTO lesson_progress (student_id, lesson_id) VALUES (?, ?)",
      [req.student.id, req.params.lessonId]
    );
    res.json({ completed: true });
  } catch (error) {
    next(error);
  }
});

app.use(express.static(path.join(__dirname, "..", "public"), {
  maxAge: process.env.NODE_ENV === "production" ? "1h" : 0,
  etag: true,
  setHeaders(res, filePath) {
    if (/\.(html|css|js)$/.test(filePath)) {
      res.setHeader("Cache-Control", "no-cache");
    }
  }
}));
app.use((req, res) => {
  res.status(404).json({ error: "Không tìm thấy đường dẫn." });
});
app.use((error, req, res, next) => {
  const status = error.status === 413 ? 413 : error.status === 400 ? 400 : 500;
  const message = status === 413
    ? "Nội dung yêu cầu vượt quá giới hạn cho phép."
    : status === 400
      ? "Nội dung JSON không hợp lệ."
      : "Đã xảy ra lỗi máy chủ. Vui lòng thử lại.";
  log(status >= 500 ? "error" : "warn", "request_failed", {
    method: req.method,
    path: req.path,
    status,
    error: error.message
  });
  if (res.headersSent) {
    return next(error);
  }
  res.status(status).json({ error: message });
});

async function start() {
  if (!process.env.DB_PASSWORD) {
    throw new Error("DB_PASSWORD must be configured");
  }
  const [columns] = await pool.query(
    "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'students'"
  );
  const existingColumns = new Set(columns.map((column) => column.COLUMN_NAME));
  if (!existingColumns.has("email")) {
    await pool.query("ALTER TABLE students ADD COLUMN email VARCHAR(254) NULL");
  }
  if (!existingColumns.has("password_hash")) {
    await pool.query("ALTER TABLE students ADD COLUMN password_hash VARCHAR(255) NULL");
  }
  if (!existingColumns.has("student_code")) {
    await pool.query("ALTER TABLE students ADD COLUMN student_code VARCHAR(50) NULL");
  }
  const [lessonColumns] = await pool.query(
    "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'lessons'"
  );
  if (!lessonColumns.some((column) => column.COLUMN_NAME === "content")) {
    await pool.query("ALTER TABLE lessons ADD COLUMN content LONGTEXT NULL");
  }
  const [indexes] = await pool.query("SHOW INDEX FROM students");
  const existingIndexes = new Set(indexes.map((index) => index.Key_name));
  if (!existingIndexes.has("students_email_unique")) {
    await pool.query("ALTER TABLE students ADD UNIQUE KEY students_email_unique (email)");
  }
  if (!existingIndexes.has("students_code_unique")) {
    await pool.query("ALTER TABLE students ADD UNIQUE KEY students_code_unique (student_code)");
  }
  await pool.query(
    `CREATE TABLE IF NOT EXISTS auth_sessions (
      session_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
      student_id VARCHAR(100) NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (session_hash),
      KEY auth_sessions_student_idx (student_id),
      KEY auth_sessions_expiry_idx (expires_at),
      CONSTRAINT auth_sessions_student_fk FOREIGN KEY (student_id)
        REFERENCES students(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  );
  await pool.query(
    `CREATE TABLE IF NOT EXISTS lesson_reads (
      student_id VARCHAR(100) NOT NULL,
      lesson_id VARCHAR(100) NOT NULL,
      read_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (student_id, lesson_id),
      CONSTRAINT lesson_reads_student_fk FOREIGN KEY (student_id)
        REFERENCES students(id) ON DELETE CASCADE,
      CONSTRAINT lesson_reads_lesson_fk FOREIGN KEY (lesson_id)
        REFERENCES lessons(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  );
  for (const [lessonId, content] of Object.entries(lessonContent)) {
    await pool.query(
      "UPDATE lessons SET content = ? WHERE id = ? AND (content IS NULL OR content = '')",
      [JSON.stringify(content), lessonId]
    );
  }
  await pool.query(
    `INSERT IGNORE INTO lesson_reads (student_id, lesson_id)
     SELECT student_id, lesson_id FROM lesson_progress`
  );
  await pool.query("DELETE FROM auth_sessions WHERE expires_at <= UTC_TIMESTAMP()");
  const server = app.listen(port, "0.0.0.0", () => {
    log("info", "server_started", { port });
  });
  const shutdown = () => {
    server.close((error) => {
      if (error) {
        log("error", "server_shutdown_failed", { error: error.message });
        process.exitCode = 1;
      }
      pool.end().catch((poolError) => {
        log("error", "database_pool_shutdown_failed", { error: poolError.message });
        process.exitCode = 1;
      });
    });
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

start().catch((error) => {
  log("error", "server_start_failed", { error: error.message });
  process.exitCode = 1;
});
