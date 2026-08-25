import os
import shutil

DRY_RUN = False

ROOT = r"C:\Fileorganization-onedrive-personal and business\JPG Onedrive Business\JPG MASTER"

def p(rel):
    return os.path.join(ROOT, rel)

counts = {"mkdir": 0, "move": 0, "rename": 0, "fixext": 0, "errors": 0}

print(f"=== {'DRY RUN' if DRY_RUN else 'LIVE RUN'} ===")
print(f"ROOT: {ROOT}\n")

# ── SECTION 1: CREATE NEW FOLDERS ────────────────────────────────────────────

NEW_DIRS = [
    r"JPG Projects\App Development",
    r"JPG Business\Brand\Visual Standards",
]

for rel in NEW_DIRS:
    full = p(rel)
    if not os.path.exists(full):
        print(f"MKDIR: {rel}")
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

# ── SECTION 2: FIX DOUBLE EXTENSIONS (rename in place) ───────────────────────

FIXEXT_OPS = [
    (r"JPG Business\Operations\JPG-BUS-TMP-IdeaLogEntryForm-WRK-v0.1.docx.docx",
     r"JPG Business\Operations\JPG-BUS-TMP-IdeaLogEntryForm-WRK-v0.1.docx"),

    (r"JPG Business\Operations\JPG-BUS-TMP-PITMasterTemplate-WRK-v0.1.docx.docx",
     r"JPG Business\Operations\JPG-BUS-TMP-PITMasterTemplate-WRK-v0.1.docx"),

    (r"JPG Projects\JPG-PROJ-DOC-AppBuildingLog-WRK-v0.1.docx.docx",
     r"JPG Projects\JPG-PROJ-DOC-AppBuildingLog-WRK-v0.1.docx"),

    (r"JPG Projects\JPG-PROJ-DOC-HubAppDomainSetup-WRK-v0.1.docx.docx",
     r"JPG Projects\JPG-PROJ-DOC-HubAppDomainSetup-WRK-v0.1.docx"),

    (r"JPG System\Playbooks\JPG-SYS-DOC-AISystemSetupGuide-WRK-v0.1.docx.docx",
     r"JPG System\Playbooks\JPG-SYS-DOC-AISystemSetupGuide-WRK-v0.1.docx"),

    (r"JPG System\Playbooks\JPG-SYS-DOC-MasterFileIndex-WRK-v0.1.docx.docx",
     r"JPG System\Playbooks\JPG-SYS-DOC-MasterFileIndex-WRK-v0.1.docx"),

    (r"JPG System\Playbooks\JPG-SYS-PB-BuildWorkflow-WRK-v0.1.docx.docx",
     r"JPG System\Playbooks\JPG-SYS-PB-BuildWorkflow-WRK-v0.1.docx"),

    (r"JPG System\Playbooks\JPG-SYS-PB-PlaybookBuildPrimer-WRK-v0.1.md.md",
     r"JPG System\Playbooks\JPG-SYS-PB-PlaybookBuildPrimer-WRK-v0.1.md"),

    (r"JPG System\Standards\JPG-BUS-DOC-DOP4x4MatrixSystem-WRK-v0.1.docx.docx",
     r"JPG System\Standards\JPG-BUS-DOC-DOP4x4MatrixSystem-WRK-v0.1.docx"),
]

for src_rel, dst_rel in FIXEXT_OPS:
    src = p(src_rel)
    dst = p(dst_rel)
    src_name = os.path.basename(src_rel)
    dst_name = os.path.basename(dst_rel)
    if os.path.exists(src):
        print(f"FIXEXT: {src_name} --> {dst_name}")
        if not DRY_RUN:
            try:
                os.rename(src, dst)
                counts["fixext"] += 1
            except Exception as e:
                print(f"  ERROR: {e}")
                counts["errors"] += 1
        else:
            counts["fixext"] += 1
    else:
        print(f"FIXEXT: {src_name}  (source not found — skipped)")

print()

# ── SECTION 3: MOVE FILES ────────────────────────────────────────────────────
# Sources below use the post-FIXEXT names (single extensions).

MOVE_OPS = [
    # Templates from Operations
    (r"JPG Business\Operations\JPG-BUS-TMP-IdeaLogEntryForm-WRK-v0.1.docx",
     r"JPG System\Templates\JPG-BUS-TMP-IdeaLogEntryForm-WRK-v0.1.docx"),

    (r"JPG Business\Operations\JPG-BUS-TMP-PITMasterTemplate-WRK-v0.1.docx",
     r"JPG System\Templates\JPG-BUS-TMP-PITMasterTemplate-WRK-v0.1.docx"),

    # App Development docs from JPG Projects root
    (r"JPG Projects\JPG-PROJ-DOC-AppBuildingLog-WRK-v0.1.docx",
     r"JPG Projects\App Development\JPG-PROJ-DOC-AppBuildingLog-WRK-v0.1.docx"),

    (r"JPG Projects\JPG-PROJ-DOC-HubAppDomainSetup-WRK-v0.1.docx",
     r"JPG Projects\App Development\JPG-PROJ-DOC-HubAppDomainSetup-WRK-v0.1.docx"),

    # Playbooks --> AI Primer System Active
    (r"JPG System\Playbooks\JPG-SYS-DOC-AISystemSetupGuide-WRK-v0.1.docx",
     r"JPG System\AI System\AI Primer System\Active\JPG-SYS-DOC-AISystemSetupGuide-WRK-v0.1.docx"),

    (r"JPG System\Playbooks\JPG-SYS-PB-PlaybookBuildPrimer-WRK-v0.1.md",
     r"JPG System\AI System\AI Primer System\Active\JPG-SYS-PB-PlaybookBuildPrimer-WRK-v0.1.md"),

    (r"JPG System\Playbooks\JPG-SYS-SOP-UseClaudeApp-WRK-v0.1.docx",
     r"JPG System\AI System\AI Primer System\Active\JPG-SYS-SOP-UseClaudeApp-WRK-v0.1.docx"),

    # Playbooks --> Standards
    (r"JPG System\Playbooks\JPG-SYS-DOC-MasterFileIndex-WRK-v0.1.docx",
     r"JPG System\Standards\JPG-SYS-DOC-MasterFileIndex-WRK-v0.1.docx"),

    # Playbooks --> Playbooks Archive
    (r"JPG System\Playbooks\JPG-SYS-PB-BuildWorkflow-WRK-v0.1.docx",
     r"JPG System\Playbooks\JPG PB FIN docs\Archive\JPG-SYS-PB-BuildWorkflow-WRK-v0.1.docx"),

    # Standards FIN v1.0 and v1.1 --> Standards Archive
    (r"JPG System\Standards\JPG-SYS-CS-CoreStandard-FIN-v1.0.docx",
     r"JPG System\Standards\Archive\JPG-SYS-CS-CoreStandard-FIN-v1.0.docx"),

    (r"JPG System\Standards\JPG-SYS-CS-CoreStandard-FIN-v1.1.docx",
     r"JPG System\Standards\Archive\JPG-SYS-CS-CoreStandard-FIN-v1.1.docx"),

    # Standards non-standard named file --> Personal Performance with rename
    (r"JPG System\Standards\Info on MET (Metabolic Equivelent of Task) and RPE (Rate of Perceived Exertion).docx",
     r"JPG Projects\Personal Performance\JPG-PROJ-DOC-METandRPEReference-WRK-v1.0.docx"),

    # Prompts PNG --> Brand Visual Standards
    (r"JPG System\Prompts\JPG-AI-DOC-ChatGPTImageOutput-WRK-v0.1.png",
     r"JPG Business\Brand\Visual Standards\JPG-AI-DOC-ChatGPTImageOutput-WRK-v0.1.png"),

    # Prompts non-standard named file --> rename in place
    (r"JPG System\Prompts\Doug's Daily Weekly Routine Prompt.docx",
     r"JPG System\Prompts\JPG-SYS-DOC-DailyWeeklyRoutinePrompt-WRK-v1.0.docx"),
]

for src_rel, dst_rel in MOVE_OPS:
    src = p(src_rel)
    dst = p(dst_rel)
    src_name = os.path.basename(src_rel)
    dst_name = os.path.basename(dst_rel)
    src_dir = os.path.dirname(src_rel)
    dst_dir = os.path.dirname(dst_rel)

    if src_dir == dst_dir:
        tag = "RENAME"
    else:
        tag = "MOVE"

    if os.path.exists(src):
        print(f"{tag}: {src_rel} --> {dst_rel}")
        if not DRY_RUN:
            try:
                os.makedirs(p(dst_dir), exist_ok=True)
                shutil.move(src, dst)
                if tag == "MOVE":
                    counts["move"] += 1
                else:
                    counts["rename"] += 1
            except Exception as e:
                print(f"  ERROR: {e}")
                counts["errors"] += 1
        else:
            if tag == "MOVE":
                counts["move"] += 1
            else:
                counts["rename"] += 1
    else:
        print(f"{tag}: {src_name}  (source not found — skipped)")

# ── SUMMARY ──────────────────────────────────────────────────────────────────

print()
print("=" * 60)
print("SUMMARY")
print("=" * 60)
print(f"Folders created  : {counts['mkdir']}")
print(f"Extensions fixed : {counts['fixext']}")
print(f"Files moved      : {counts['move']}")
print(f"Files renamed    : {counts['rename']}")
print(f"Errors           : {counts['errors']}")
print("=" * 60)
