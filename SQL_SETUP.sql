-- Create students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  registered_at TIMESTAMP DEFAULT NOW(),
  flag_found BOOLEAN DEFAULT FALSE,
  solved_time TIMESTAMP,
  submission_time_seconds INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create settings table
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_unlocked BOOLEAN DEFAULT FALSE,
  correct_flag VARCHAR(100) DEFAULT 'BIOMOLECLUESS',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (challenge_unlocked, correct_flag)
VALUES (FALSE, 'BIOMOLECULES');

-- Create indexes for better performance
CREATE INDEX idx_students_flag_found ON students(flag_found);
CREATE INDEX idx_students_solved_time ON students(solved_time);
CREATE INDEX idx_students_name ON students(name);
