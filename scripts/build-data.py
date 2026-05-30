import os
import json

root = os.getcwd()

def normalized_upload_path(value):
    if not value or not isinstance(value, str):
        return value
    return value.lstrip('/')

# 1. Compile Students
students_dir = os.path.join(root, "data", "students")
students_output_path = os.path.join(root, "data", "students.json")

try:
    files = [f for f in os.listdir(students_dir) if f.endswith('.json')]
    students = []
    
    for file in files:
        full_path = os.path.join(students_dir, file)
        with open(full_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
            # Normalize student
            id_ = data.get("student_id")
            class_no = data.get("class_no", "11")
            pdfs = data.get("pdfs", {})
            for k in list(pdfs.keys()):
                pdfs[k] = normalized_upload_path(pdfs[k])
                
            data["photo"] = normalized_upload_path(data.get("photo", ""))
            data["pdfs"] = pdfs
            data["generated_pdf_names"] = {
                "ct1": f"pdfs/{id_}-{class_no}-ct1.pdf" if id_ else "",
                "ct2": f"pdfs/{id_}-{class_no}-ct2.pdf" if id_ else "",
                "hy": f"pdfs/{id_}-{class_no}-hy.pdf" if id_ else "",
                "ct3": f"pdfs/{id_}-{class_no}-ct3.pdf" if id_ else "",
                "yearly": f"pdfs/{id_}-{class_no}-y.pdf" if id_ else ""
            }
            students.append(data)
            
    students.sort(key=lambda x: int(x.get("position") or 9999))
    
    os.makedirs(os.path.dirname(students_output_path), exist_ok=True)
    with open(students_output_path, "w", encoding="utf-8") as f:
        json.dump({"students": students}, f, indent=2, ensure_ascii=False)
    print(f"Generated data/students.json with {len(students)} students.")
except Exception as e:
    print("Error building student data:", e)

# 2. Compile Rooms
rooms_dir = os.path.join(root, "data", "rooms")
rooms_output_path = os.path.join(root, "data", "rooms.json")

try:
    room_files = [f for f in os.listdir(rooms_dir) if f.endswith('.json')]
    rooms = []
    
    for file in room_files:
        full_path = os.path.join(rooms_dir, file)
        with open(full_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            if data.get("photos"):
                data["photos"] = [normalized_upload_path(p) for p in data["photos"]]
            rooms.append(data)
            
    # Sort rooms numerically by room_no
    rooms.sort(key=lambda x: int(x.get("room_no") or 0))
    
    with open(rooms_output_path, "w", encoding="utf-8") as f:
        json.dump({"rooms": rooms}, f, indent=2, ensure_ascii=False)
    print(f"Generated data/rooms.json with {len(rooms)} rooms.")
except Exception as e:
    print("Error building room data:", e)
