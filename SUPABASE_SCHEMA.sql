-- =====================================================
-- VestibulAI - Database Schema SQL
-- PostgreSQL 17.6
-- =====================================================
-- Execute this in Supabase SQL Editor

-- =====================================================
-- Create ENUM types
-- =====================================================
CREATE TYPE "StudyPlanStatus" AS ENUM ('PENDING', 'COMPLETED', 'MISSED');
CREATE TYPE "EssayStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'GRADED');

-- =====================================================
-- Create User Table
-- =====================================================
CREATE TABLE "User" (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT,
  email           TEXT UNIQUE NOT NULL,
  "passwordHash"  TEXT NOT NULL,
  "targetCourse"  TEXT,
  "dailyStudyHours" DOUBLE PRECISION,
  "createdAt"     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Create Subject Table
-- =====================================================
CREATE TABLE "Subject" (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT UNIQUE NOT NULL,
  description TEXT,
  weight      DOUBLE PRECISION DEFAULT 1.0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Create Question Table
-- =====================================================
CREATE TABLE "Question" (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "subjectId"       UUID NOT NULL REFERENCES "Subject"(id) ON DELETE CASCADE,
  statement         TEXT NOT NULL,
  options           JSONB NOT NULL,
  "correctOption"   TEXT NOT NULL,
  difficulty        INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
  source            TEXT,
  "createdAt"       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Create UserProgress Table
-- =====================================================
CREATE TABLE "UserProgress" (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId"            UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "subjectId"         UUID NOT NULL REFERENCES "Subject"(id) ON DELETE CASCADE,
  "questionsAnswered" INTEGER DEFAULT 0,
  "correctAnswers"    INTEGER DEFAULT 0,
  "estimatedLevel"    DOUBLE PRECISION DEFAULT 1.0 CHECK ("estimatedLevel" >= 1.0 AND "estimatedLevel" <= 5.0),
  "lastActivityAt"    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("userId", "subjectId")
);

-- =====================================================
-- Create StudyPlan Table
-- =====================================================
CREATE TABLE "StudyPlan" (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId"    UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "subjectId" UUID NOT NULL REFERENCES "Subject"(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  "durationMin" INTEGER NOT NULL,
  status      "StudyPlanStatus" DEFAULT 'PENDING',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Create Essay Table
-- =====================================================
CREATE TABLE "Essay" (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId"  UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  theme     TEXT NOT NULL,
  content   TEXT NOT NULL,
  score     JSONB,
  feedback  TEXT,
  status    "EssayStatus" DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Create Indexes for Performance
-- =====================================================
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_question_subject ON "Question"("subjectId");
CREATE INDEX idx_userprogress_user ON "UserProgress"("userId");
CREATE INDEX idx_userprogress_subject ON "UserProgress"("subjectId");
CREATE INDEX idx_studyplan_user ON "StudyPlan"("userId");
CREATE INDEX idx_studyplan_subject ON "StudyPlan"("subjectId");
CREATE INDEX idx_essay_user ON "Essay"("userId");

-- =====================================================
-- Seed Initial Data
-- =====================================================

-- Insert Subjects (Materias)
INSERT INTO "Subject" (name, description, weight) VALUES
  ('Matemática', 'Cálculo, Álgebra, Geometria', 1.2),
  ('Português', 'Literatura, Gramática, Interpretação', 1.0),
  ('Biologia', 'Célula, Genética, Ecologia', 1.1),
  ('História', 'Brasil e Mundo', 0.9),
  ('Física', 'Mecânica, Eletromagnetismo', 1.2)
ON CONFLICT (name) DO NOTHING;

-- Get Subject IDs for further operations
WITH subject_ids AS (
  SELECT id, name FROM "Subject"
)

-- Insert Sample Questions
INSERT INTO "Question" (
  "subjectId", 
  statement, 
  options, 
  "correctOption", 
  difficulty, 
  source
) 
SELECT 
  (SELECT id FROM "Subject" WHERE name = 'Matemática') as "subjectId",
  'Qual é o resultado de 2 + 2?' as statement,
  '[
    {"id": "a", "text": "3"},
    {"id": "b", "text": "4"},
    {"id": "c", "text": "5"},
    {"id": "d", "text": "6"}
  ]'::jsonb as options,
  'b' as "correctOption",
  1 as difficulty,
  'AI Generated' as source

UNION ALL

SELECT 
  (SELECT id FROM "Subject" WHERE name = 'Matemática'),
  'Resolva: x² - 5x + 6 = 0',
  '[
    {"id": "a", "text": "x = 1 ou x = 6"},
    {"id": "b", "text": "x = 2 ou x = 3"},
    {"id": "c", "text": "x = -2 ou x = -3"},
    {"id": "d", "text": "x = 0 ou x = 5"}
  ]'::jsonb,
  'b',
  3,
  'AI Generated'

UNION ALL

SELECT 
  (SELECT id FROM "Subject" WHERE name = 'Português'),
  'Qual é o sujeito da frase: "O gato subiu no telhado"?',
  '[
    {"id": "a", "text": "O telhado"},
    {"id": "b", "text": "O gato"},
    {"id": "c", "text": "Subiu"},
    {"id": "d", "text": "Indeterminado"}
  ]'::jsonb,
  'b',
  1,
  'AI Generated';
