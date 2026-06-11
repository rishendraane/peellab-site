import json

with open(r"d:\PeelLab\PEELLAB WEBSITE\peellab\src\data\catalog_audit.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print("DUPLICATE PRODUCTS FOUND:")
for issue in data["issues_found"]:
    if "Duplicate" in issue:
        print(f"  {issue}")

print("\nDUPLICATE IMAGES FOUND:")
for dup in data["duplicates"]:
    print(f"  {dup}")
