import os
import shutil

DRY_RUN = False

PERSONAL = r"C:\Fileorganization-onedrive-personal and business\DMJ ODB Personal Files"
BUSINESS = r"C:\Fileorganization-onedrive-personal and business\JPG ODB Business Files\JPG MASTER"

counts = {"copied": 0, "errors": 0}

print("=== DRY RUN ===" if DRY_RUN else "=== LIVE RUN ===")
print()

COPIES = [
    (
        r"JPG - Jones Performance Group Stuff\App related (Docs)\JPG - APP Changes Word doc (living doc).docx",
        r"JPG Projects\App Development\JPG - APP Changes Word doc (living doc).docx",
    ),
    (
        r"JPG - Jones Performance Group Stuff\Files and Filders to be stored on LOCAL (APP Stagging related)\Break your app into modules - GPT trenchwork to hand to CAI.docx",
        r"JPG Projects\App Development\Break your app into modules - GPT trenchwork to hand to CAI.docx",
    ),
    (
        r"JPG - Jones Performance Group Stuff\Files and Filders to be stored on LOCAL (APP Stagging related)\JPG_PIT_v8_042826 (1) Text CODE.html",
        r"JPG Projects\App Development\JPG_PIT_v8_042826 Text CODE.html",
    ),
    (
        r"JPG - Jones Performance Group Stuff\Files and Folders that have been moved to One Drive Business\App log in screen look - colors etc  Black background with gold accents to be used.docx",
        r"JPG Business\Brand\Visual Standards\App log in screen look - colors etc.docx",
    ),
    (
        r"JPG - Jones Performance Group Stuff\Files and Folders that have been moved to One Drive Business\JPG-FD-001-EDU-v4_FourFoundationsOverview_FINAL-END(1).docx",
        r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Archive\JPG-FD-001-EDU-v4_FourFoundationsOverview_FINAL-END.docx",
    ),
    (
        r"JPG - Jones Performance Group Stuff\Files and Folders that have been moved to One Drive Business\JPG-FD-005-EDU-v1_Foundation04_MentalSpiritual.docx",
        r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Archive\JPG-FD-005-EDU-v1_Foundation04_MentalSpiritual.docx",
    ),
    (
        r"JPG - Jones Performance Group Stuff\Files and Folders that have been moved to One Drive Business\JPG-FD-OV-001-EDU-v4_FourFoundationsOverview_FINAL.docx",
        r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Archive\JPG-FD-OV-001-EDU-v4_FourFoundationsOverview_FINAL.docx",
    ),
    (
        r"JPG - Jones Performance Group Stuff\Files and Folders that have been moved to One Drive Business\JPG-SYS-TMP-DocumentTemplate-FIN-v1.0 (1).docx",
        r"JPG System\Templates\JPG-SYS-TMP-DocumentTemplate-FIN-v1.0.docx",
    ),
    (
        r"JPG - Jones Performance Group Stuff\Files and Folders that have been moved to One Drive Business\LIMITLESS - with verse Basic White on black.docx",
        r"JPG Business\Brand\Logo\LIMITLESS - with verse Basic White on black.docx",
    ),
    (
        r"JPG - Jones Performance Group Stuff\Files and Folders that have been moved to One Drive Business\Tat Design LIMIT LESS with Verse above (WORD PNG FILE).docx",
        r"JPG Business\Brand\Logo\Tat Design LIMIT LESS with Verse above.docx",
    ),
    (
        r"JPG - Jones Performance Group Stuff\Files and Folders that have been moved to One Drive Business\THE DOP 4X4 MATRIX SYSTEM.docx",
        r"JPG System\Standards\THE DOP 4X4 MATRIX SYSTEM.docx",
    ),
    (
        r"JPG - Jones Performance Group Stuff\Files and Folders that have been moved to One Drive Business\JPG_PIT_v8_042826 (1) Text CODE.html",
        r"JPG Projects\App Development\JPG_PIT_v8_042826 Text CODE.html",
    ),
    (
        r"JPG - Jones Performance Group Stuff\The AI Data Room Guide.docx",
        r"JPG System\AI System\AI Data Room\The AI Data Room Guide.docx",
    ),
    (
        r"JPG - Jones Performance Group Stuff\Files and Folders that have been moved to One Drive Business\PIT NEW MASTER TEMPLATE - April 2026.docx",
        r"JPG System\Templates\PIT NEW MASTER TEMPLATE - April 2026.docx",
    ),
]

for src_rel, dst_rel in COPIES:
    src = os.path.join(PERSONAL, src_rel)
    dst = os.path.join(BUSINESS, dst_rel)
    dst_dir = os.path.dirname(dst)

    if not os.path.isfile(src):
        print(f"  ERROR: source not found: {src}")
        counts["errors"] += 1
        continue

    print(f"COPY: {src_rel}")
    print(f"  --> {dst_rel}")

    if not DRY_RUN:
        try:
            os.makedirs(dst_dir, exist_ok=True)
            shutil.copy2(src, dst)
        except Exception as e:
            print(f"  ERROR: {e}")
            counts["errors"] += 1
            continue

    counts["copied"] += 1
    print()

print()
print("--- SUMMARY ---")
print(f"Files copied: {counts['copied']}")
print(f"Errors:       {counts['errors']}")
