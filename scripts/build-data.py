import os
import json

root = os.getcwd()

def normalized_upload_path(value):
    if not value or not isinstance(value, str):
        return value
    return value.lstrip('/')

# 1. Normalize Students
students_path = os.path.join(root, "data", "students.json")

try:
    if os.path.exists(students_path):
        with open(students_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        students = data.get("students", [])
        normalized_students = []
        
        for student in students:
            id_ = student.get("student_id")
            class_no = student.get("class_no", "11")
            pdfs = student.get("pdfs", {})
            for k in list(pdfs.keys()):
                pdfs[k] = normalized_upload_path(pdfs[k])
                
            student["photo"] = normalized_upload_path(student.get("photo", ""))
            student["pdfs"] = pdfs
            student["generated_pdf_names"] = {
                "ct1": f"pdfs/{id_}-{class_no}-ct1.pdf" if id_ else "",
                "ct2": f"pdfs/{id_}-{class_no}-ct2.pdf" if id_ else "",
                "hy": f"pdfs/{id_}-{class_no}-hy.pdf" if id_ else "",
                "ct3": f"pdfs/{id_}-{class_no}-ct3.pdf" if id_ else "",
                "yearly": f"pdfs/{id_}-{class_no}-y.pdf" if id_ else ""
            }
            normalized_students.append(student)
            
        normalized_students.sort(key=lambda x: int(x.get("position") or 9999))
        
        with open(students_path, "w", encoding="utf-8") as f:
            json.dump({"students": normalized_students}, f, indent=2, ensure_ascii=False)
        print(f"Normalized data/students.json with {len(normalized_students)} students.")
    else:
        print("data/students.json does not exist. Skipping student normalization.")
except Exception as e:
    print("Error normalizing student data:", e)

# 2. Normalize Rooms
rooms_path = os.path.join(root, "data", "rooms.json")

try:
    if os.path.exists(rooms_path):
        with open(rooms_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        rooms = data.get("rooms", [])
        normalized_rooms = []
        
        for room in rooms:
            if room.get("photos"):
                room["photos"] = [normalized_upload_path(p) for p in room["photos"]]
            normalized_rooms.append(room)
            
        normalized_rooms.sort(key=lambda x: int(x.get("room_no") or 0))
        
        with open(rooms_path, "w", encoding="utf-8") as f:
            json.dump({"rooms": normalized_rooms}, f, indent=2, ensure_ascii=False)
        print(f"Normalized data/rooms.json with {len(normalized_rooms)} rooms.")
    else:
        print("data/rooms.json does not exist. Skipping room normalization.")
except Exception as e:
    print("Error normalizing room data:", e)
