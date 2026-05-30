import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

// Normalize upload paths from CMS
function normalizedUploadPath(value) {
  if (!value || typeof value !== "string") return value;
  return value.replace(/^\/+/, "");
}

// 1. Compile Students
const studentsDir = path.join(root, "data", "students");
const studentsOutputPath = path.join(root, "data", "students.json");

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

try {
  const files = (await readdir(studentsDir)).filter((file) => file.endsWith(".json"));
  const students = [];

  for (const file of files) {
    const fullPath = path.join(studentsDir, file);
    const data = JSON.parse(await readFile(fullPath, "utf8"));
    students.push(normalizeStudent(data));
  }

  students.sort((a, b) => Number(a.position || 9999) - Number(b.position || 9999));

  await mkdir(path.dirname(studentsOutputPath), { recursive: true });
  await writeFile(studentsOutputPath, `${JSON.stringify({ students }, null, 2)}\n`, "utf8");

  console.log(`Generated data/students.json with ${students.length} students.`);
} catch (err) {
  console.error("Error building student data:", err);
}

// 2. Compile Rooms
const roomsDir = path.join(root, "data", "rooms");
const roomsOutputPath = path.join(root, "data", "rooms.json");

try {
  const roomFiles = (await readdir(roomsDir)).filter((file) => file.endsWith(".json"));
  const rooms = [];

  for (const file of roomFiles) {
    const fullPath = path.join(roomsDir, file);
    const data = JSON.parse(await readFile(fullPath, "utf8"));
    if (data.photos) {
      data.photos = data.photos.map(normalizedUploadPath);
    }
    rooms.push(data);
  }

  rooms.sort((a, b) => String(a.room_no).localeCompare(String(b.room_no), undefined, { numeric: true }));

  await writeFile(roomsOutputPath, `${JSON.stringify({ rooms }, null, 2)}\n`, "utf8");
  console.log(`Generated data/rooms.json with ${rooms.length} rooms.`);
} catch (err) {
  console.error("Error building room data:", err);
}
