import os
import shutil

DRY_RUN = False

ROOT       = r"C:\Fileorganization-onedrive-personal and business\JPG MASTER"
LEGACY     = r"C:\Fileorganization-onedrive-personal and business\TPD Legacy Files"
BRAND_LOGO = r"C:\Fileorganization-onedrive-personal and business\JPG MASTER\JPG Business\Brand\Logo"

counts = {
    "folders_created": 0,
    "items_deleted": 0,
    "files_copied": 0,
    "extensions_fixed": 0,
    "errors": 0,
}

print("=== DRY RUN ===" if DRY_RUN else "=== LIVE RUN ===")
print()


# ─── helpers ──────────────────────────────────────────────────────────────────

def mkdir(path):
    print(f"MKDIR: {path}")
    if not DRY_RUN:
        try:
            os.makedirs(path, exist_ok=True)
            counts["folders_created"] += 1
        except Exception as e:
            print(f"  ERROR: {e}")
            counts["errors"] += 1
    else:
        counts["folders_created"] += 1


def delete_file(path, reason=""):
    label = f"DELETE: {path}"
    if reason:
        label += f"  [{reason}]"
    print(label)
    if not DRY_RUN:
        try:
            os.remove(path)
            counts["items_deleted"] += 1
        except Exception as e:
            print(f"  ERROR: {e}")
            counts["errors"] += 1
    else:
        counts["items_deleted"] += 1


def delete_folder(path, reason=""):
    label = f"DELETE: {path}"
    if reason:
        label += f"  [{reason}]"
    print(label)
    if not DRY_RUN:
        try:
            shutil.rmtree(path)
            counts["items_deleted"] += 1
        except Exception as e:
            print(f"  ERROR: {e}")
            counts["errors"] += 1
    else:
        counts["items_deleted"] += 1


def copy_file(src, dst, rename):
    dst_path = os.path.join(dst, rename)
    print(f"COPY: {src} --> {dst_path}")
    if not DRY_RUN:
        try:
            os.makedirs(dst, exist_ok=True)
            shutil.copy2(src, dst_path)
            counts["files_copied"] += 1
        except Exception as e:
            print(f"  ERROR: {e}")
            counts["errors"] += 1
    else:
        counts["files_copied"] += 1


def fix_ext(path, new_name):
    new_path = os.path.join(os.path.dirname(path), new_name)
    print(f"FIXEXT: {path} --> {new_path}")
    if not DRY_RUN:
        try:
            os.rename(path, new_path)
            counts["extensions_fixed"] += 1
        except Exception as e:
            print(f"  ERROR: {e}")
            counts["errors"] += 1
    else:
        counts["extensions_fixed"] += 1


# ─── SECTION 1: CREATE TARGET FOLDERS ────────────────────────────────────────

print("--- SECTION 1: CREATE TARGET FOLDERS ---")
for name in [
    "Business Planning",
    "Identity and Branding",
    "Framework and System",
    "AI and Technology",
    "General Reference",
]:
    mkdir(os.path.join(LEGACY, name))
print()


# ─── SECTION 2: DELETE JUNK AND EMPTY PLACEHOLDERS ───────────────────────────

print("--- SECTION 2: DELETE JUNK AND PLACEHOLDERS ---")

# Single junk file
url_file = os.path.join(LEGACY, "TPD-BUS-DOC-DougWorkNotes-ARC-v1.0.url")
if os.path.isfile(url_file) or DRY_RUN:
    delete_file(url_file, "junk url shortcut")

# Recursively delete empty "New folder" placeholders
PLACEHOLDER_NAMES = {
    "New folder",
    "New folder (2)",
    "New folder (3)",
    "New folder (4)",
    "New folder (5)",
}
# Walk bottom-up so children are handled before parents
for dirpath, dirnames, filenames in os.walk(LEGACY, topdown=False):
    basename = os.path.basename(dirpath)
    if basename in PLACEHOLDER_NAMES:
        is_empty = len(os.listdir(dirpath)) == 0
        if is_empty or DRY_RUN:
            delete_folder(dirpath, "empty placeholder")

# Whole folders to delete (contain only placeholders, no real files)
junk_folders = [
    "TPD-BUS-DOC-AdminFinance-ARC-v1.0",
    "TPD-BUS-DOC-ClientInformation-ARC-v1.0",
    "TPD-BUS-REF-Attachments-ARC-v1.0",
    "TPD-BUS-REF-Miscellaneous-ARC-v1.0",
    "TPD-SYS-REF-M365BusinessFiles-ARC-v1.0",
]
for folder in junk_folders:
    path = os.path.join(LEGACY, folder)
    if os.path.isdir(path) or DRY_RUN:
        delete_folder(path, "placeholder-only folder")

# Specific junk files in Logos subfolder
LOGOS = os.path.join(LEGACY, "TPD-BUS-DOC-GeneralDocuments-ARC-v1.0", "JPG Logos")
logo_junk = [
    "JPG Logo White on Black - PNG.html",
    "Doc2.docx",
    "ai-agents-in-the-enterprise.pdf",
    "JPG Logo white background.docx",
    "JPG Logo's.docx",
]
for f in logo_junk:
    p = os.path.join(LOGOS, f)
    if os.path.isfile(p) or DRY_RUN:
        delete_file(p, "junk file in Logos")

# Delete the browser-export _files subfolder entirely
files_subfolder = os.path.join(LOGOS, "JPG Logo White on Black - PNG_files")
if os.path.isdir(files_subfolder) or DRY_RUN:
    delete_folder(files_subfolder, "browser export folder")

print()


# ─── SECTION 3: COPY LOGO PNGs TO BRAND FOLDER ───────────────────────────────

print("--- SECTION 3: COPY LOGO PNGs ---")

logo_copies = [
    (
        "JPG Logo - White on Black with Star - PNG.png",
        "JPG-BUS-DOC-LogoWhiteOnBlackStar-FIN-v1.0.png",
    ),
    (
        "JPG Logo Black on White - PNG.png",
        "JPG-BUS-DOC-LogoBlackOnWhite-FIN-v1.0.png",
    ),
    (
        "JPG Patch Logo - Black on White - PNG.png",
        "JPG-BUS-DOC-LogoPatchBlackOnWhite-FIN-v1.0.png",
    ),
]

all_copied = True
for src_name, dst_name in logo_copies:
    src = os.path.join(LOGOS, src_name)
    if os.path.isfile(src) or DRY_RUN:
        copy_file(src, BRAND_LOGO, dst_name)
    else:
        print(f"  ERROR: source not found: {src}")
        counts["errors"] += 1
        all_copied = False

if all_copied or DRY_RUN:
    # Delete Logos subfolder after successful copies
    if os.path.isdir(LOGOS) or DRY_RUN:
        delete_folder(LOGOS, "logos extracted — source cleanup")
    # Delete now-empty parent
    GENERAL_DOCS = os.path.join(LEGACY, "TPD-BUS-DOC-GeneralDocuments-ARC-v1.0")
    if os.path.isdir(GENERAL_DOCS) or DRY_RUN:
        delete_folder(GENERAL_DOCS, "now empty after logo extraction")

print()


# ─── SECTION 4: FIX DOUBLE EXTENSIONS ────────────────────────────────────────

print("--- SECTION 4: FIX DOUBLE EXTENSIONS ---")

double_ext_files = [
    (
        "TPD-BUS-DOC-AIPlatformUsageAccount-ARC-v1.1.docx.docx",
        "TPD-BUS-DOC-AIPlatformUsageAccount-ARC-v1.1.docx",
    ),
    (
        "TPD-BUS-DOC-BoardRoomMembersAIIntegration-ARC-v1.0.docx.docx",
        "TPD-BUS-DOC-BoardRoomMembersAIIntegration-ARC-v1.0.docx",
    ),
]

for old_name, new_name in double_ext_files:
    old_path = os.path.join(LEGACY, old_name)
    if os.path.isfile(old_path) or DRY_RUN:
        fix_ext(old_path, new_name)
    else:
        print(f"  SKIP: {old_path}  [file not found]")

print()


# ─── SUMMARY ──────────────────────────────────────────────────────────────────

print("--- SUMMARY ---")
print(f"Folders created:   {counts['folders_created']}")
print(f"Items deleted:     {counts['items_deleted']}")
print(f"Files copied:      {counts['files_copied']}")
print(f"Extensions fixed:  {counts['extensions_fixed']}")
print(f"Errors:            {counts['errors']}")
