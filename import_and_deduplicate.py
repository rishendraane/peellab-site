import os
import shutil
import hashlib
import json
from PIL import Image, ImageDraw, ImageFilter, ImageOps
import numpy as np

src_dir = r"D:\PeelLab\STICKERS"
dest_dir = r"d:\PeelLab\PEELLAB WEBSITE\peellab\public\stickers\processed"
catalog_dest = r"d:\PeelLab\PEELLAB WEBSITE\peellab\src\data"

os.makedirs(dest_dir, exist_ok=True)
os.makedirs(catalog_dest, exist_ok=True)

extensions = ('.png', '.jpg', '.jpeg', '.webp')

# Define Category folder to slug/label map
CATEGORY_MAP = {
    "ANIME": {"slug": "anime", "label": "Anime"},
    "GAMES": {"slug": "gaming", "label": "Gaming"},
    "SHOWS & MOVIES": {"slug": "shows", "label": "Shows & Movies"},
    "CODING": {"slug": "coding", "label": "Coding"},
    "MEMES": {"slug": "memes", "label": "Memes"},
    "CARS": {"slug": "cars", "label": "Cars"},
    "OTHER": {"slug": "other", "label": "Other"},
    "UNCATEGORIZED": {"slug": "memes", "label": "Memes"}
}

# 22 Collage filenames to map
collage_source_mapping = {
    "gojo_8e0c09314545.png": r"ANIME\Jujutsu Kaisen\gojo__8e0c09314545.jpg",
    "this_contains_an_image_of_todo_aoi_sticker_todo_57.png": r"ANIME\Tokyo Revengers\this_contains_an_image_of_todo_aoi_sticker_todo_57b39a4531fc.jpg",
    "anime_stickers_attack_on_titan_1_mikasa_sticker_ad.png": r"ANIME\Attack on Titan\anime_stickers_attack_on_titan_1_mikasa_sticker_adc9527b4d91.jpg",
    "sticker_d0059d9475e7.png": r"ANIME\Demon Slayer\sticker_d0059d9475e7.jpg",
    "sticker_40e476f59cb8_.png": r"ANIME\Jujutsu Kaisen\sticker_40e476f59cb8_dup1.jpg",
    "sticker_a37c532adcc9.png": r"ANIME\Attack on Titan\sticker_a37c532adcc9.jpg",
    "ben_10_printable_sticker_cb78b4405dbd.png": r"ANIME\Ben 10\ben_10_printable_sticker_cb78b4405dbd.jpg",
    "the_codefather_sticker.png": r"CODING\The Godfather\the_codefather_sticker_9eeb485dc049.jpg",
    "funny_computer_programmer_t_shirt_i_need_a_break_c.png": r"CODING\HTML\Funny Computer Programmer T-shirt - I Need A Break Code Tee Sticker _ I-need-a-break.jpeg",
    "get_my_art_printed_on_awesome_products_support_me.png": r"CODING\Hello World\Get my art printed on awesome products_ Support me at Redbubble #RBandME_ https___www.redbubble.com_i_sticker_Hello-world-by-FASA-STREET_154588055.jpeg",
    "skyline_r34_brian_o_conner_sticker_bd000dba4b3c.png": r"CARS\Fast and Furious\skyline_r34_brian_o_conner_sticker_bd000dba4b3c.jpg",
    "muscle_car_sticker_432c714b6b40.png": r"CARS\Classic Muscle Car\muscle_car_sticker_432c714b6b40.jpg",
    "sticker_0509429cdae1.png": r"CARS\Red Bull Racing\sticker_0509429cdae1.jpg",
    "sticker_8a3138589dd6.png": r"ANIME\Adventure Time\sticker_8a3138589dd6.jpg",
    "kratos_god_of_war_1f7fc0da8cde.png": r"GAMES\General\kratos_god_of_war_1f7fc0da8cde.jpg",
    "crash_bandicoot_sticker_crash_bandicoot_925f140fd5.png": r"GAMES\Crash Bandicoot\crash_bandicoot_sticker_crash_bandicoot_925f140fd52c.jpg",
    "rdr2_merch_magnet_3770aae059bd.png": r"GAMES\Red Dead Redemption\rdr2_merch_magnet_3770aae059bd.jpg",
    "imagem_4befef19e703.png": r"GAMES\Among Us\imagem_4befef19e703.jpg",
    "ozl_0d902119194c.png": r"UNCATEGORIZED\Absolut Vodka\ozl_0d902119194c.jpg",
    "sticker_1d775999a140.png": r"ANIME\Attack on Titan\sticker_1d775999a140.jpg",
    "sticker_67be636b3b34.png": r"SHOWS & MOVIES\Breaking Bad\sticker_67be636b3b34.jpg",
    "sticker_a21f02125e2e_.png": r"SHOWS & MOVIES\Breaking Bad\sticker_a21f02125e2e_dup1.jpg"
}

print("1. Scanning all files in STICKERS...")
all_files = []
for root, dirs, files in os.walk(src_dir):
    # Skip visual_review_contact_sheets directory entirely
    dirs[:] = [d for d in dirs if d.lower() != "visual_review_contact_sheets"]
    for f in files:
        if f.lower().endswith(extensions):
            all_files.append(os.path.join(root, f))

total_scanned = len(all_files)
print(f"Total files scanned: {total_scanned}")

print("2. Grouping exact duplicates by SHA256...")
hash_to_files = {}
for path in all_files:
    try:
        with open(path, 'rb') as f:
            h = hashlib.sha256(f.read()).hexdigest()
        if h not in hash_to_files:
            hash_to_files[h] = []
        hash_to_files[h].append(path)
    except Exception as e:
        print(f"Error hashing {path}: {e}")

exact_duplicate_groups = 0
exact_duplicates_removed = 0
unique_by_hash_files = []

# Map every file path to its canonical SHA256 counterpart
filepath_to_canonical = {}

for h, files in hash_to_files.items():
    files.sort(key=lambda x: (len(x), x))  # stable sort
    canonical = files[0]
    unique_by_hash_files.append(canonical)
    for f in files:
        filepath_to_canonical[f] = canonical
    if len(files) > 1:
        exact_duplicate_groups += 1
        exact_duplicates_removed += (len(files) - 1)

print(f"Exact duplicates removed: {exact_duplicates_removed}")

print("3. Generating visual signatures for resolution duplicates...")
image_data = []
for i, path in enumerate(unique_by_hash_files):
    if i % 100 == 0:
        print(f"  Processed {i}/{len(unique_by_hash_files)} signatures...")
    try:
        img = Image.open(path).convert('L')
        width, height = img.size
        # Resize to 16x16
        img_resized = img.resize((16, 16), Image.Resampling.BILINEAR)
        pixels = np.array(img_resized, dtype=np.float32)
        # Normalize
        p_min, p_max = pixels.min(), pixels.max()
        if p_max > p_min:
            pixels = (pixels - p_min) / (p_max - p_min)
        else:
            pixels = np.zeros_like(pixels)
            
        rel_path = os.path.relpath(path, src_dir)
        parts = rel_path.split(os.sep)
        
        # Get category slug & label
        cat_folder = parts[0].upper() if len(parts) > 0 else "UNCATEGORIZED"
        cat_info = CATEGORY_MAP.get(cat_folder, {"slug": cat_folder.lower(), "label": cat_folder.title()})
        category_slug = cat_info["slug"]
        category_label = cat_info["label"]
        
        # Get franchise slug & label
        if len(parts) > 2:
            franchise_label = parts[1]
        elif len(parts) == 2:
            franchise_label = parts[1]
        else:
            franchise_label = "Other"
            
        # Format franchise slug
        franchise_slug = franchise_label.lower().replace(" & ", "-").replace(" ", "-")
        for char in [",", "'", "\"", "(", ")", "[", "]", "&", ".", "_"]:
            franchise_slug = franchise_slug.replace(char, "")
        while "--" in franchise_slug:
            franchise_slug = franchise_slug.replace("--", "-")
        franchise_slug = franchise_slug.strip("-")
        
        # Category overrides for folders misplaced on the device filesystem
        FRANCHISE_CATEGORY_OVERRIDES = {
            "demon-slayer": {"slug": "anime", "label": "Anime"},
            "rick-and-morty": {"slug": "shows", "label": "Shows & Movies"},
            "levis": {"slug": "memes", "label": "Memes"},
        }
        if franchise_slug in FRANCHISE_CATEGORY_OVERRIDES:
            override = FRANCHISE_CATEGORY_OVERRIDES[franchise_slug]
            category_slug = override["slug"]
            category_label = override["label"]
        
        image_data.append({
            'index': i,
            'path': path,
            'rel_path': rel_path,
            'filename': os.path.basename(path),
            'category_slug': category_slug,
            'category_label': category_label,
            'franchise_slug': franchise_slug,
            'franchise_label': franchise_label,
            'width': width,
            'height': height,
            'area': width * height,
            'signature': pixels.flatten()
        })
    except Exception as e:
        print(f"Error loading signature for {path}: {e}")

print("4. Identifying resolution duplicates within categories...")
parent = list(range(len(image_data)))

def find(idx):
    if parent[idx] == idx:
        return idx
    parent[idx] = find(parent[idx])
    return parent[idx]

def union(idx1, idx2):
    root1 = find(idx1)
    root2 = find(idx2)
    if root1 != root2:
        parent[root1] = root2

threshold = 0.08
for i in range(len(image_data)):
    for j in range(i + 1, len(image_data)):
        if image_data[i]['category_slug'] == image_data[j]['category_slug']:
            # Calculate Mean Absolute Difference
            mad = np.mean(np.abs(image_data[i]['signature'] - image_data[j]['signature']))
            if mad < threshold:
                union(i, j)

# Group resolution duplicates together
groups = {}
for i in range(len(image_data)):
    root = find(i)
    if root not in groups:
        groups[root] = []
    groups[root].append(i)

resolution_duplicates_removed = 0
final_unique_stickers = []

# Map every signature index to its canonical resolution-grouped signature index
sig_idx_to_canonical_sig_idx = {}

for root, indices in groups.items():
    # Keep highest resolution version
    indices.sort(key=lambda idx: (-image_data[idx]['area'], image_data[idx]['path']))
    canonical_idx = indices[0]
    final_unique_stickers.append(image_data[canonical_idx])
    for idx in indices:
        sig_idx_to_canonical_sig_idx[idx] = canonical_idx
    if len(indices) > 1:
        resolution_duplicates_removed += (len(indices) - 1)

print(f"Resolution duplicates removed: {resolution_duplicates_removed}")
print(f"Final unique sticker count: {len(final_unique_stickers)}")

# Map original filepath to the final unique sticker object
filepath_to_unique_sticker = {}
for path in all_files:
    canonical_hash_path = filepath_to_canonical[path]
    # find signature of canonical hash path
    for s in image_data:
        if s['path'] == canonical_hash_path:
            canonical_sig_idx = sig_idx_to_canonical_sig_idx[s['index']]
            filepath_to_unique_sticker[path] = image_data[canonical_sig_idx]
            break

# Process unique images and build catalog
print("5. Processing unique images and compiling catalog...")
catalog = []

# Group unique stickers by franchise to assign #001, #002 sequence names
franchise_groups = {}
for s in final_unique_stickers:
    key = (s['category_slug'], s['franchise_slug'])
    if key not in franchise_groups:
        franchise_groups[key] = []
    franchise_groups[key].append(s)

def process_image_fast(file_path, dest_path):
    img = Image.open(file_path).convert("RGBA")
    width, height = img.size
    
    # Downscale first for extreme performance and consistent relative border size
    max_size = 500
    if width > max_size or height > max_size:
        if width > height:
            new_w = max_size
            new_h = int(height * (max_size / width))
        else:
            new_h = max_size
            new_w = int(width * (max_size / height))
        img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        width, height = img.size
    
    seeds = [(0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1)]
    for seed in seeds:
        color = img.getpixel(seed)
        if color[3] == 0:
            continue
        if color[0] >= 180 and color[1] >= 180 and color[2] >= 180:
            ImageDraw.floodfill(img, seed, (0, 0, 0, 0), thresh=45)
            
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    border_thickness = 8
    padded_img = ImageOps.expand(img, border=border_thickness * 2, fill=(0, 0, 0, 0))
    alpha = padded_img.split()[3]
    dilated_alpha = alpha.filter(ImageFilter.MaxFilter(border_thickness * 2 + 1))
    
    white_bg = Image.new("RGBA", padded_img.size, (255, 255, 255, 255))
    white_border = Image.composite(white_bg, Image.new("RGBA", padded_img.size, (0, 0, 0, 0)), dilated_alpha)
    
    final_img = Image.alpha_composite(white_border, padded_img)
    final_bbox = final_img.getbbox()
    if final_bbox:
        final_img = final_img.crop(final_bbox)
        
    final_img.save(dest_path, "PNG", optimize=True)

# Process each group and write to catalog
processed_count = 0
unique_sticker_to_catalog_item = {}

for (cat_slug, fran_slug), stickers_list in franchise_groups.items():
    # Sort alphabetically by original filename to make numbering stable
    stickers_list.sort(key=lambda s: s['filename'])
    
    for idx, s in enumerate(stickers_list):
        num_str = f"{idx + 1:03d}"
        
        # Display Name: [Franchise] Sticker #[3-digit-number]
        # If franchise is Other or empty, use Category name
        fran_label = s['franchise_label']
        if fran_label.lower() in ["other", "general"]:
            fran_label = s['category_label']
        display_name = f"{fran_label} Sticker #{num_str}"
        
        # Product ID: [cat_slug]-[franchise_slug]-sticker-[num]
        prod_id = f"{cat_slug}-{fran_slug}-sticker-{num_str}"
        if fran_slug.lower() in ["other", "general"]:
            prod_id = f"{cat_slug}-sticker-{num_str}"
            
        dest_filename = f"{prod_id}.png"
        dest_filepath = os.path.join(dest_dir, dest_filename)
        
        # Process and save
        try:
            if not os.path.exists(dest_filepath):
                process_image_fast(s['path'], dest_filepath)
        except Exception as e:
            print(f"Error processing image {s['path']}: {e}")
            # fallback copy
            if not os.path.exists(dest_filepath):
                shutil.copy(s['path'], dest_filepath)
            
        processed_count += 1
        if processed_count % 100 == 0:
            print(f"  Processed {processed_count}/{len(final_unique_stickers)} images...")
            
        # Featured logic: First 2 in each franchise are featured, capped at some sensible count
        featured = (idx < 2)
        
        catalog_item = {
            "id": prod_id,
            "name": display_name,
            "category": cat_slug,
            "franchise": fran_slug,
            "price": 19,
            "image": f"/stickers/processed/{dest_filename}",
            "featured": featured
        }
        catalog.append(catalog_item)
        unique_sticker_to_catalog_item[s['path']] = catalog_item

# Add Mystery Pack
mystery_pack = {
    "id": "mystery-pack",
    "name": "Mystery Pack (8–10 Random)",
    "category": "mystery",
    "franchise": "other",
    "price": 99,
    "image": "/stickers/processed/mystery_pack_v2.png",
    "featured": True
}
catalog.append(mystery_pack)

print("6. Writing catalog JSONs...")
with open(os.path.join(catalog_dest, "unique_catalog.json"), "w", encoding="utf-8") as f:
    json.dump(catalog, f, indent=2)

with open(os.path.join(catalog_dest, "catalog.json"), "w", encoding="utf-8") as f:
    json.dump(catalog, f, indent=2)

print("7. Generating duplicates_report.json...")
report = {
    "total_files_scanned": total_scanned,
    "exact_duplicates_removed": exact_duplicates_removed,
    "resolution_duplicates_removed": resolution_duplicates_removed,
    "final_unique_sticker_count": len(final_unique_stickers)
}
with open(os.path.join(catalog_dest, "duplicates_report.json"), "w", encoding="utf-8") as f:
    json.dump(report, f, indent=2)

print("8. Generating collage mapping and copying collage assets...")
collage_path_mapping = {}
for old_name, src_rel_path in collage_source_mapping.items():
    full_src_path = os.path.join(src_dir, src_rel_path)
    if os.path.exists(full_src_path):
        unique_stick = filepath_to_unique_sticker[full_src_path]
        cat_item = unique_sticker_to_catalog_item[unique_stick['path']]
        collage_path_mapping[old_name] = cat_item['image']
        
        # Copy to the collage filename to ensure homepage doesn't break
        src_processed = os.path.join(dest_dir, os.path.basename(cat_item['image']))
        dst_processed = os.path.join(dest_dir, old_name)
        shutil.copy(src_processed, dst_processed)
        print(f"  Mapped & copied collage asset: {old_name} -> {os.path.basename(cat_item['image'])}")
    else:
        print(f"Warning: Collage source {src_rel_path} not found!")

with open(os.path.join(catalog_dest, "collage_mapping.json"), "w", encoding="utf-8") as f:
    json.dump(collage_path_mapping, f, indent=2)

print("\n--- REPORT SUMMARY ---")
print(f"Total files scanned: {total_scanned}")
print(f"Exact duplicates removed: {exact_duplicates_removed}")
print(f"Resolution duplicates removed: {resolution_duplicates_removed}")
print(f"Final unique sticker count: {len(final_unique_stickers)}")
print(f"Collage mapped keys count: {len(collage_path_mapping)}")
print("Audit & Import Complete!")
