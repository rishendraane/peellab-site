with open(r"d:\PeelLab\PEELLAB WEBSITE\peellab\import_and_deduplicate.py", "r", encoding="utf-8") as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if "def process_image_fast" in line or "prod_id =" in line:
        print(f"Line {idx+1}: {line.strip()}")
