-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('M', 'F');

-- CreateTable
CREATE TABLE "students" (
    "student_id" BIGSERIAL NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "major_id" BIGINT NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "gender" "Gender" NOT NULL,
    "cohort_year" BIGINT NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "majors" (
    "major_id" BIGSERIAL NOT NULL,
    "major" TEXT NOT NULL,

    CONSTRAINT "majors_pkey" PRIMARY KEY ("major_id")
);

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_major_id_fkey" FOREIGN KEY ("major_id") REFERENCES "majors"("major_id") ON DELETE RESTRICT ON UPDATE CASCADE;
