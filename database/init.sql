SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS students (
  id VARCHAR(100) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(254) NULL,
  password_hash VARCHAR(255) NULL,
  student_code VARCHAR(50) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY students_email_unique (email),
  UNIQUE KEY students_code_unique (student_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS auth_sessions (
  session_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  student_id VARCHAR(100) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (session_hash),
  KEY auth_sessions_student_idx (student_id),
  KEY auth_sessions_expiry_idx (expires_at),
  CONSTRAINT auth_sessions_student_fk FOREIGN KEY (student_id)
    REFERENCES students(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  instructor VARCHAR(255) NOT NULL,
  duration_hours INT NOT NULL,
  level VARCHAR(50) NOT NULL,
  accent VARCHAR(30) NOT NULL DEFAULT 'blue',
  PRIMARY KEY (id),
  CONSTRAINT courses_duration_positive CHECK (duration_hours > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lessons (
  id VARCHAR(100) NOT NULL,
  course_id VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  duration_minutes INT NOT NULL,
  position INT NOT NULL,
  content LONGTEXT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY lessons_course_position_unique (course_id, position),
  CONSTRAINT lessons_course_fk FOREIGN KEY (course_id)
    REFERENCES courses(id) ON DELETE CASCADE,
  CONSTRAINT lessons_duration_positive CHECK (duration_minutes > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS enrollments (
  student_id VARCHAR(100) NOT NULL,
  course_id VARCHAR(100) NOT NULL,
  enrolled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (student_id, course_id),
  CONSTRAINT enrollments_student_fk FOREIGN KEY (student_id)
    REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT enrollments_course_fk FOREIGN KEY (course_id)
    REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lesson_progress (
  student_id VARCHAR(100) NOT NULL,
  lesson_id VARCHAR(100) NOT NULL,
  completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (student_id, lesson_id),
  KEY progress_student_idx (student_id),
  CONSTRAINT progress_student_fk FOREIGN KEY (student_id)
    REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT progress_lesson_fk FOREIGN KEY (lesson_id)
    REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lesson_reads (
  student_id VARCHAR(100) NOT NULL,
  lesson_id VARCHAR(100) NOT NULL,
  read_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (student_id, lesson_id),
  CONSTRAINT lesson_reads_student_fk FOREIGN KEY (student_id)
    REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT lesson_reads_lesson_fk FOREIGN KEY (lesson_id)
    REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO courses (id, title, category, description, instructor, duration_hours, level, accent)
VALUES
  ('web-foundation', 'Lập trình Web từ con số 0', 'Lập trình', 'Nắm vững HTML, CSS và JavaScript để tự tay xây dựng trang web đầu tiên.', 'Nguyễn Minh Anh', 12, 'Cơ bản', 'blue'),
  ('python-data', 'Python thực chiến cho người mới', 'Lập trình', 'Học Python qua bài tập thực hành, xử lý dữ liệu và những dự án nhỏ.', 'Trần Quốc Bảo', 16, 'Cơ bản', 'violet'),
  ('ui-design', 'Tư duy thiết kế UI/UX', 'Thiết kế', 'Từ nghiên cứu người dùng đến wireframe và giao diện sản phẩm chỉn chu.', 'Lê Thu Hà', 9, 'Trung cấp', 'orange'),
  ('sql-database', 'SQL và cơ sở dữ liệu', 'Dữ liệu', 'Thiết kế bảng, viết truy vấn hiệu quả và làm việc với MySQL.', 'Phạm Hoàng Long', 10, 'Cơ bản', 'green');

INSERT IGNORE INTO lessons (id, course_id, title, duration_minutes, position)
VALUES
  ('web-01', 'web-foundation', 'Chào mừng & tư duy lập trình web', 18, 1),
  ('web-02', 'web-foundation', 'HTML: cấu trúc trang web', 32, 2),
  ('web-03', 'web-foundation', 'CSS: màu sắc và bố cục', 40, 3),
  ('web-04', 'web-foundation', 'JavaScript: tạo tương tác', 45, 4),
  ('py-01', 'python-data', 'Cài đặt và làm quen Python', 20, 1),
  ('py-02', 'python-data', 'Biến, kiểu dữ liệu và câu lệnh', 35, 2),
  ('py-03', 'python-data', 'Vòng lặp và cấu trúc dữ liệu', 42, 3),
  ('py-04', 'python-data', 'Xây dựng ứng dụng đầu tiên', 50, 4),
  ('ui-01', 'ui-design', 'UI/UX và tư duy lấy người dùng làm trung tâm', 25, 1),
  ('ui-02', 'ui-design', 'Nghiên cứu và phác thảo wireframe', 38, 2),
  ('ui-03', 'ui-design', 'Hệ thống màu sắc và kiểu chữ', 34, 3),
  ('ui-04', 'ui-design', 'Hoàn thiện prototype trong Figma', 46, 4),
  ('sql-01', 'sql-database', 'Cơ sở dữ liệu quan hệ', 24, 1),
  ('sql-02', 'sql-database', 'SELECT, lọc và sắp xếp dữ liệu', 36, 2),
  ('sql-03', 'sql-database', 'JOIN và tổng hợp dữ liệu', 40, 3),
  ('sql-04', 'sql-database', 'Thiết kế bảng và ràng buộc', 42, 4);
