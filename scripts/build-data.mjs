import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

// Normalize upload paths from CMS
function normalizedUploadPath(value) {
  if (!value || typeof value !== "string") return value;
  return value.replace(/^\/+/, "");
}

// 1. Normalize Students
const studentsPath = path.join(root, "data", "students.json");

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
  if (existsSync(studentsPath)) {
    const data = JSON.parse(await readFile(studentsPath, "utf8"));
    const students = (data.students || []).map(normalizeStudent);

    students.sort((a, b) => Number(a.position || 9999) - Number(b.position || 9999));

    await writeFile(studentsPath, `${JSON.stringify({ students }, null, 2)}\n`, "utf8");
    console.log(`Normalized data/students.json with ${students.length} students.`);
  } else {
    console.log("data/students.json does not exist. Skipping student normalization.");
  }
} catch (err) {
  console.error("Error normalizing student data:", err);
}

// 2. Normalize Rooms
const roomsPath = path.join(root, "data", "rooms.json");

try {
  if (existsSync(roomsPath)) {
    const data = JSON.parse(await readFile(roomsPath, "utf8"));
    const rooms = data.rooms || [];

    for (const room of rooms) {
      if (room.photos) {
        room.photos = room.photos.map(normalizedUploadPath);
      }
    }

    rooms.sort((a, b) => String(a.room_no).localeCompare(String(b.room_no), undefined, { numeric: true }));

    await writeFile(roomsPath, `${JSON.stringify({ rooms }, null, 2)}\n`, "utf8");
    console.log(`Normalized data/rooms.json with ${rooms.length} rooms.`);
  } else {
    console.log("data/rooms.json does not exist. Skipping room normalization.");
  }
} catch (err) {
  console.error("Error normalizing room data:", err);
}
