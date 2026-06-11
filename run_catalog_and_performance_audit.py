import os
import json

catalog_path = r"d:\PeelLab\PEELLAB WEBSITE\peellab\src\data\catalog.json"
processed_dir = r"d:\PeelLab\PEELLAB WEBSITE\peellab\public\stickers\processed"
src_data_dir = r"d:\PeelLab\PEELLAB WEBSITE\peellab\src\data"

print("Starting pre-launch catalog audit...")

if not os.path.exists(catalog_path):
    print("Error: catalog.json not found!")
    exit(1)

with open(catalog_path, "r", encoding="utf-8") as f:
    catalog = json.load(f)

print(f"Total entries in catalog: {len(catalog)}")

issues = []
warnings = []
duplicates = []
checked_ids = set()
checked_images = set()

total_size_bytes = 0
large_images = [] # files > 250KB

# Audit items
for idx, item in enumerate(catalog):
    # Check ID uniqueness
    prod_id = item.get("id")
    if not prod_id:
        issues.append(f"Item #{idx} is missing an ID.")
    elif prod_id in checked_ids:
        issues.append(f"Duplicate product ID found: {prod_id}")
    else:
        checked_ids.add(prod_id)
        
    # Check Name
    name = item.get("name")
    if not name:
        issues.append(f"Product {prod_id} is missing a Name.")
        
    # Check Category and Franchise
    cat = item.get("category")
    fran = item.get("franchise")
    if not cat:
        issues.append(f"Product {prod_id} is missing Category.")
    if not fran:
        issues.append(f"Product {prod_id} is missing Franchise.")
        
    # Check Image Path and Existence
    img_path = item.get("image")
    if not img_path:
        issues.append(f"Product {prod_id} is missing Image path.")
    else:
        # Check duplicate image usage across different products
        if img_path in checked_images:
            duplicates.append(f"Duplicate image usage: {img_path} used in multiple products.")
        else:
            checked_images.add(img_path)
            
        # Verify physical file existence
        # Image path is e.g. "/stickers/processed/jujutsu-kaisen-sticker-001.png"
        rel_img_path = img_path.lstrip("/")
        # Path inside public folder
        abs_img_path = os.path.join(r"d:\PeelLab\PEELLAB WEBSITE\peellab\public", rel_img_path)
        
        if not os.path.exists(abs_img_path):
            issues.append(f"Product {prod_id} has broken image path: {img_path} (File does not exist)")
        else:
            # Check file size for performance
            sz = os.path.getsize(abs_img_path)
            total_size_bytes += sz
            if sz > 250 * 1024: # > 250 KB
                large_images.append({
                    "id": prod_id,
                    "image": img_path,
                    "size_kb": round(sz / 1024, 2)
                })

print("\n--- AUDIT RESULTS ---")
print(f"Total Unique Products: {len(checked_ids)}")
print(f"Total Broken Images: {sum(1 for x in issues if 'broken image' in x)}")
print(f"Total ID Duplicates: {sum(1 for x in issues if 'Duplicate product ID' in x)}")
print(f"Total Image Duplicates: {len(duplicates)}")
print(f"Total Large Images (>250KB): {len(large_images)}")
if total_size_bytes > 0:
    print(f"Average Image Size: {round((total_size_bytes / len(checked_images)) / 1024, 2)} KB")

# Write catalog_audit.json
audit_report = {
    "total_products": len(catalog),
    "unique_products": len(checked_ids),
    "issues_found": issues,
    "warnings": warnings,
    "duplicates": duplicates,
    "large_assets": large_images,
    "average_asset_size_kb": round((total_size_bytes / max(1, len(checked_images))) / 1024, 2)
}

with open(os.path.join(src_data_dir, "catalog_audit.json"), "w", encoding="utf-8") as f:
    json.dump(audit_report, f, indent=2)
print("catalog_audit.json successfully generated.")
