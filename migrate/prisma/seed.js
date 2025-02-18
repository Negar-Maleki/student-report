import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const cockroach = new PrismaClient({
  datasources: { db: { url: process.env.CACHROACH_DATABASE_URL } },
});
const postgres = new PrismaClient({
  datasources: { db: { url: process.env.POSTGRES_DATABASE_URL } },
});

async function migrateData() {
  console.log("🔄 Fetching students from CockroachDB...");

  const majors = await cockroach.$queryRaw`SELECT * FROM majors`;

  console.log(`✅ Found ${majors.length} majors. Migrating to PostgreSQL...`);

  for (const major of majors) {
    try {
      // 🛑 Check if required fields are missing
      console.log(major);
      await postgres.major.create({
        data: {
          major_id: major.major_id,
          major: major.major,
        },
      });
    } catch (error) {
      console.error(
        `❌ Error migrating major ${major.major_id || "undefined"}:`,
        error.message
      );
    }
  }
  // Fetch all students
  const students = await cockroach.$queryRaw`SELECT * FROM students`;

  for (const student of students) {
    try {
      // 🛑 Check if required fields are missing
      if (!student.full_name) {
        console.warn(`⚠️ Skipping student ${student.id}: missing full_name`);
        continue;
      }

      await postgres.student.create({
        data: {
          student_id: student.student_id, // Ensure ID format is correct
          full_name: student.full_name, // Ensure required field is included
          major_id: student.major_id, // Ensure required field is included
          date_of_birth: student.date_of_birth,
          gender: student.gender,
          cohort_year: student.cohort_year,
        },
      });

      console.log(`✅ Migrated student: ${student.full_name}`);
    } catch (error) {
      console.error(
        `❌ Error migrating student ${student.id || "undefined"}:`,
        error.message
      );
    }
  }

  console.log("✅ Data migration completed successfully!");

  await cockroach.$disconnect();
  await postgres.$disconnect();
}

migrateData().catch((error) => {
  console.error("❌ Migration failed:", error);
});
