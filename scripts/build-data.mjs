import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const studentsDir = path.join(root, "data", "students");
const outputPath = path.join(root, "data", "students.json");

function normalizedUploadPath(value) {
  if (!value || typeof value !== "string") return value;
  return value.replace(/^\/+/, "");
}

function normalizeStudent(student) {
  const id = student.student_id;
  const classNo = student.class_no || "11";
  const pdfs = student.pdfs || {};

  for (const [key, value] of Object.entries(pdfs)) {
    pdfs[key] = normalizedUploadPath(value);
  }

  return {
    ...student,
    photo: normalizedUploadPath(student.photo),
    pdfs,
    generated_pdf_names: {
      ct1: id ? `pdfs/${id}-${classNo}-ct1.pdf` : "",
      ct2: id ? `pdfs/${id}-${classNo}-ct2.pdf` : "",
      hy: id ? `pdfs/${id}-${classNo}-hy.pdf` : "",
      ct3: id ? `pdfs/${id}-${classNo}-ct3.pdf` : "",
      yearly: id ? `pdfs/${id}-${classNo}-y.pdf` : ""
    }
  };
}

const files = (await readdir(studentsDir)).filter((file) => file.endsWith(".json"));
const students = [];

for (const file of files) {
  const fullPath = path.join(studentsDir, file);
  const data = JSON.parse(await readFile(fullPath, "utf8"));
  students.push(normalizeStudent(data));
}

students.sort((a, b) => Number(a.position || 9999) - Number(b.position || 9999));

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify({ students }, null, 2)}\n`, "utf8");

console.log(`Generated data/students.json with ${students.length} students.`);
