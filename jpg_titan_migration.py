import os
import shutil

DRY_RUN = False

SRC_ROOT = r"C:\Titan Personal Development LLC - Backup Files"
DST_ROOT = r"C:\Fileorganization-onedrive-personal and business\JPG Onedrive Business\JPG MASTER\Archive - Titan Personal Development"

counts = {"mkdir": 0, "move": 0, "errors": 0}

print(f"=== {'DRY RUN' if DRY_RUN else 'LIVE RUN'} ===")
print(f"SOURCE: {SRC_ROOT}")
print(f"TARGET: {DST_ROOT}\n")

# ── SECTION 1: CREATE TARGET FOLDERS ─────────────────────────────────────────

TARGET_DIRS = [
    "TPD Current Tasks",
    "TPD Forms 1",
    "TPD Forms 2",
    "TPD Old Tasks",
]

for rel in TARGET_DIRS:
    full = os.path.join(DST_ROOT, rel)
    if not os.path.exists(full):
        print(f"MKDIR: {os.path.join(DST_ROOT, rel)}")
        if not DRY_RUN:
            try:
                os.makedirs(full, exist_ok=True)
                counts["mkdir"] += 1
            except Exception as e:
                print(f"  ERROR: {e}")
                counts["errors"] += 1
        else:
            counts["mkdir"] += 1
    else:
        print(f"MKDIR: {rel}  (already exists — skipped)")

print()

# ── SECTION 2: MOVE FILES ─────────────────────────────────────────────────────

def move_files_from(src_dir, dst_dir, label=""):
    """Move all files directly inside src_dir into dst_dir (no recursion)."""
    if not os.path.isdir(src_dir):
        print(f"  WARN: source folder not found — {src_dir}")
        return
    for fname in sorted(os.listdir(src_dir)):
        src_file = os.path.join(src_dir, fname)
        if not os.path.isfile(src_file):
            continue  # skip subdirs — handled separately
        dst_file = os.path.join(dst_dir, fname)
        # Handle filename collision
        if os.path.exists(dst_file):
            base, ext = os.path.splitext(fname)
            dst_file = os.path.join(dst_dir, f"{base}_DUPE{ext}")
            print(f"MOVE: {src_file} --> {dst_file}  [collision — renamed]")
        else:
            print(f"MOVE: {src_file} --> {dst_file}")
        if not DRY_RUN:
            try:
                os.makedirs(dst_dir, exist_ok=True)
                shutil.move(src_file, dst_file)
                counts["move"] += 1
            except Exception as e:
                print(f"  ERROR: {e}")
                counts["errors"] += 1
        else:
            counts["move"] += 1

# 1. TPD Current Tasks
print("--- TPD Current Tasks ---")
move_files_from(
    os.path.join(SRC_ROOT, "TPD - CURRENT TASK TO BE COMPLEATED FOR BUILDING TPD 02022026 Start"),
    os.path.join(DST_ROOT, "TPD Current Tasks"),
)
print()

# 2. TPD Forms 1 — root files + flatten two subfolders
print("--- TPD Forms 1 (root files) ---")
move_files_from(
    os.path.join(SRC_ROOT, "TPD - Forms creation Backup"),
    os.path.join(DST_ROOT, "TPD Forms 1"),
)
print()
print("--- TPD Forms 1 (from: To Be Uploaded to 2ND Chat) ---")
move_files_from(
    os.path.join(SRC_ROOT, "TPD - Forms creation Backup", "To Be Uploaded to 2ND Chat"),
    os.path.join(DST_ROOT, "TPD Forms 1"),
)
print()
print("--- TPD Forms 1 (from: Uploaded to 2ND Chat Already) ---")
move_files_from(
    os.path.join(SRC_ROOT, "TPD - Forms creation Backup", "Uploaded to 2ND Chat Already"),
    os.path.join(DST_ROOT, "TPD Forms 1"),
)
print()

# 3. TPD Forms 2
print("--- TPD Forms 2 ---")
move_files_from(
    os.path.join(SRC_ROOT, "TPD - Forms creation Backup 2"),
    os.path.join(DST_ROOT, "TPD Forms 2"),
)
print()

# 4. TPD Old Tasks
print("--- TPD Old Tasks ---")
move_files_from(
    os.path.join(SRC_ROOT, "TPD - OLD Tasks to be compleated by date - not using this one)"),
    os.path.join(DST_ROOT, "TPD Old Tasks"),
)
print()

# ── SECTION 3: DELETE EMPTY SOURCE FOLDERS ───────────────────────────────────

def delete_if_empty(path):
    """Remove folder if it exists and is empty."""
    if not os.path.exists(path):
        return
    if os.listdir(path):
        print(f"DELETE SKIP: {path}  (not empty — check manually)")
        return
    print(f"DELETE: {path}")
    if not DRY_RUN:
        try:
            os.rmdir(path)
        except Exception as e:
            print(f"  ERROR: {e}")
            counts["errors"] += 1

print("--- Deleting empty source folders ---")

# Delete subfolders first, then parent folders, then root
delete_if_empty(os.path.join(SRC_ROOT, "TPD - Forms creation Backup", "To Be Uploaded to 2ND Chat"))
delete_if_empty(os.path.join(SRC_ROOT, "TPD - Forms creation Backup", "Uploaded to 2ND Chat Already"))
delete_if_empty(os.path.join(SRC_ROOT, "TPD - CURRENT TASK TO BE COMPLEATED FOR BUILDING TPD 02022026 Start"))
delete_if_empty(os.path.join(SRC_ROOT, "TPD - Forms creation Backup"))
delete_if_empty(os.path.join(SRC_ROOT, "TPD - Forms creation Backup 2"))
delete_if_empty(os.path.join(SRC_ROOT, "TPD - OLD Tasks to be compleated by date - not using this one)"))
delete_if_empty(SRC_ROOT)

# ── SUMMARY ──────────────────────────────────────────────────────────────────

print()
print("=" * 60)
print("SUMMARY")
print("=" * 60)
print(f"Folders created : {counts['mkdir']}")
print(f"Files moved     : {counts['move']}")
print(f"Errors          : {counts['errors']}")
print("=" * 60)
