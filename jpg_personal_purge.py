import os
import shutil

DRY_RUN = False

ROOT = r"C:\Fileorganization-onedrive-personal and business\DMJ ODB Personal Files"
JPG  = os.path.join(ROOT, "JPG - Jones Performance Group Stuff")

counts = {"folders": 0, "files": 0, "skipped": 0, "not_found": 0, "errors": 0}

print("=== DRY RUN ===" if DRY_RUN else "=== LIVE RUN ===")
print()

# ─── protected files — never touch ────────────────────────────────────────────

PROTECTED = {
    os.path.normcase(os.path.join(ROOT, "2024_TaxReturn.pdf")),
    os.path.normcase(os.path.join(ROOT, "2025_CA_RETURN_2026-03-28_071653.pdf")),
    os.path.normcase(os.path.join(ROOT, "2025_FEDERAL_RETURN_2026-03-28_071650.pdf")),
    os.path.normcase(os.path.join(ROOT, "Mozilla-Recovery-Key_2026-02-15_sycowboy100@gmail.com.pdf")),
    os.path.normcase(os.path.join(ROOT, "My plan - in divorce.docx")),
}


# ─── helpers ──────────────────────────────────────────────────────────────────

def delete_folder(path):
    if os.path.normcase(path) in PROTECTED:
        print(f"SKIP: {path}  [protected]")
        counts["skipped"] += 1
        return
    if not os.path.isdir(path):
        print(f"NOT FOUND: {path}")
        counts["not_found"] += 1
        return
    print(f"DELETE FOLDER: {path}")
    if not DRY_RUN:
        try:
            shutil.rmtree(path)
        except Exception as e:
            print(f"  ERROR: {e}")
            counts["errors"] += 1
            return
    counts["folders"] += 1


def delete_file(path):
    if os.path.normcase(path) in PROTECTED:
        print(f"SKIP: {path}  [protected]")
        counts["skipped"] += 1
        return
    if not os.path.isfile(path):
        print(f"NOT FOUND: {path}")
        counts["not_found"] += 1
        return
    print(f"DELETE FILE: {path}")
    if not DRY_RUN:
        try:
            os.remove(path)
        except Exception as e:
            print(f"  ERROR: {e}")
            counts["errors"] += 1
            return
    counts["files"] += 1


# ─── SECTION 1: DELETE FOLDERS ────────────────────────────────────────────────

print("--- SECTION 1: FOLDERS ---")
folders_to_delete = [
    "AI DATA Room Docs",
    "App related (Docs)",
    "Files and Folder to be moved to One Drive Business (Stagging)",
    "Files and Folders that have been moved to One Drive Business",
    "Items for AI Data Room #1",
    "JPG 14 - Day Tracking Onboarding App Info",
    "JPG DOP App Creation docs",
    "JPG HUB App Creation docs",
    "JPG PIT App Creation docs",
    "Downloads",
    "Files and Filders to be stored on LOCAL (APP Stagging related)",
    "Training Plans and Fitness",
    "Items for AI Data Room #2",
]

for name in folders_to_delete:
    delete_folder(os.path.join(JPG, name))

print()


# ─── SECTION 2: DELETE SPECIFIC FILES ─────────────────────────────────────────

print("--- SECTION 2: FILES ---")
files_to_delete = [
    "The AI Data Room Guide.docx",
]

for name in files_to_delete:
    delete_file(os.path.join(JPG, name))

print()


# ─── SUMMARY ──────────────────────────────────────────────────────────────────

print("--- SUMMARY ---")
print(f"Folders deleted: {counts['folders']}")
print(f"Files deleted:   {counts['files']}")
print(f"Skipped:         {counts['skipped']}")
print(f"Not found:       {counts['not_found']}")
print(f"Errors:          {counts['errors']}")
