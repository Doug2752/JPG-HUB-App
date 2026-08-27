import os
import shutil

DRY_RUN = False

LEGACY     = r"C:\Fileorganization-onedrive-personal and business\TPD Legacy Files"
ROOT       = r"C:\Fileorganization-onedrive-personal and business\JPG MASTER"
BRAND_LOGO = r"C:\Fileorganization-onedrive-personal and business\JPG MASTER\JPG Business\Brand\Logo"

BP = os.path.join(LEGACY, "Business Planning")
IB = os.path.join(LEGACY, "Identity and Branding")
FS = os.path.join(LEGACY, "Framework and System")
AT = os.path.join(LEGACY, "AI and Technology")
GR = os.path.join(LEGACY, "General Reference")

counts = {"copied": 0, "skipped": 0, "dupes": 0, "errors": 0}

# Track destination filenames per folder to catch within-run dupes in dry run
_seen: dict = {}

SKIP_SET = {
    "JPG_Client_Disclaimer_v2.docx",
    "Info on MET (Metabolic Equivelent of Task) and RPE (Rate of Perceived Exertion).docx",
    "JPG-SYS-CS-CoreStandard-WRK-v1.4.docx",
    "JPG-SYS-CS-CoreStandard-WRK-v1.7 (5) (1).docx",
    "JPG-SYS-DOC-DocStructurePrimer-WRK-v1.6.docx",
    "JPG-SYS-PB-02-FileStorage-WRK-v3.1.docx",
    "JPG-SYS-PB-02-FileStorage-WRK-v3_2.docx",
    "JPG-SYS-PB-03-NamingSystem-WRK-v2.1.docx",
    "JPG-SYS-PB-03-NamingSystem-WRK-v2_2.docx",
    "JPG-SYS-PB-09-VersionControl-WRK-v2_1.docx",
    "JPG-FILE-MANAGEMENT-SETUP-GUIDE-v1.0.md",
    "JPG-Session-Handoff-UPDATED.md",
    "JPG_Four_Foundations_v4.docx",
    "JPG_Logo_base64.txt",
}

print("=== DRY RUN ===" if DRY_RUN else "=== LIVE RUN ===")
print()


# ─── helpers ──────────────────────────────────────────────────────────────────

def _resolve_dst(dst_dir, dst_name):
    """Return final dst_name (with _DUPE if needed), update _seen tracker."""
    key = dst_dir
    if key not in _seen:
        _seen[key] = set()
    # Also check what's actually on disk (for live runs and pre-existing files)
    on_disk = os.path.exists(os.path.join(dst_dir, dst_name))
    in_seen = dst_name in _seen[key]
    is_dupe = on_disk or in_seen
    if is_dupe:
        base, ext = os.path.splitext(dst_name)
        dst_name = base + "_DUPE" + ext
    _seen[key].add(dst_name)
    return dst_name, is_dupe


def copy_to(src, dst_dir, dst_name=None):
    """Copy src → dst_dir, renaming to dst_name if given. Handles dupes."""
    if dst_name is None:
        dst_name = os.path.basename(src)

    if not os.path.isfile(src):
        print(f"  ERROR: not found: {src}")
        counts["errors"] += 1
        return

    dst_name, is_dupe = _resolve_dst(dst_dir, dst_name)
    dst_path = os.path.join(dst_dir, dst_name)

    if not DRY_RUN:
        dupe_note = " [_DUPE]" if is_dupe else ""
        print(f"COPY: {src} --> {dst_path}{dupe_note}")
        try:
            os.makedirs(dst_dir, exist_ok=True)
            shutil.copy2(src, dst_path)
        except Exception as e:
            print(f"  ERROR: {e}")
            counts["errors"] += 1
            return

    if is_dupe:
        counts["dupes"] += 1
    counts["copied"] += 1


def skip(name, reason):
    print(f"SKIP: {name}  [{reason}]")
    counts["skipped"] += 1


def copy_named(src_dir, dst_dir, filenames):
    """Copy a list of named files from src_dir into dst_dir."""
    for name in filenames:
        src = os.path.join(src_dir, name)
        copy_to(src, dst_dir)


def copy_all_files(src_dir, dst_dir):
    """Copy every file (non-recursive) in src_dir into dst_dir."""
    if not os.path.isdir(src_dir):
        print(f"  ERROR: folder not found: {src_dir}")
        counts["errors"] += 1
        return
    for name in sorted(os.listdir(src_dir)):
        src = os.path.join(src_dir, name)
        if os.path.isfile(src):
            copy_to(src, dst_dir)


# ─── SECTION 1: LOGO PNGs → BRAND_LOGO ───────────────────────────────────────

LOGOS = os.path.join(LEGACY, "TPD-BUS-DOC-GeneralDocuments-ARC-v1.0", "JPG Logos")

logo_copies = [
    ("JPG Logo - White on Black with Star - PNG.png",
     "JPG-BUS-DOC-LogoWhiteOnBlackStar-FIN-v1.0.png"),
    ("JPG Logo Black on White - PNG.png",
     "JPG-BUS-DOC-LogoBlackOnWhite-FIN-v1.0.png"),
    ("JPG Patch Logo - Black on White - PNG.png",
     "JPG-BUS-DOC-LogoPatchBlackOnWhite-FIN-v1.0.png"),
]

for src_name, dst_name in logo_copies:
    copy_to(os.path.join(LOGOS, src_name), BRAND_LOGO, dst_name)


# ─── SECTION 2: BUSINESS PLANNING ────────────────────────────────────────────

FD = os.path.join(LEGACY, "TPD-BUS-DOC-FileDownloads-ARC-v1.0.docx")
TC = os.path.join(LEGACY, "TPD-BUS-DOC-TimelineChecklists-ARC-v1.0")
BD = os.path.join(LEGACY, "TPD-BUS-DOC-BusinessDevelopment-ARC-v1.0")

copy_named(TC, BP, [
    "Business Platform Setup Checklist - TO DO with Dats FEB 2026.docx",
    "TPD Files_Master Document Inventory List_02162026_V1.docx",
    "TPD PLATFORM COMPLETION CHECKLIST Timeline - Claude AI 02152026.docx",
    "TPD_Master_Launch_Plan_V1.0_2026-02-15.docx",
])

copy_named(BD, BP, [
    "TPD Files_Master Document Inventory List_02162026_V1.docx",
])

copy_named(FD, BP, [
    "TPD_FILES_BusinessPlan_02162026_V3.docx",
    "TPD_File_IdentitySystem_FullExpansion_02172026_V1.docx",
])

copy_named(os.path.join(FD, "Business Plan"), BP, [
    "TitanPD_BusinessPlan_FINAL.docx",
    "TPD File_BusinessPlan_FINAL_UPDATED.docx",
    "TPD_FILES_BusinessPlan_02162026_V3.docx",
])


# ─── SECTION 3: IDENTITY AND BRANDING ────────────────────────────────────────

GF = os.path.join(LEGACY, "TPD-BUS-DOC-GeneralFiles-ARC-v1.0")
AI_REVIEW = os.path.join(GF, "TPD Files_Compleated AI Review_02162026_V1.docx")

copy_named(FD, IB, [
    "TPD_File_Branding_Statement_02172026_V1.docx",
    "TPD_File_Branding_Statement_02172026_V2.docx",
    "TPD_File_Branding_Statement_02172026_V3.docx",
    "TPD_File_Niche_Statement_02172026_V1.docx",
    "TPD_File_Niche_Statement_02172026_V2.docx",
    "TPD_File_Niche_Statement_02172026_V3.docx",
    "TPD_File_TitanPerformanceCode_02172026_V1.docx",
    "TPD_FILES_IdentityStatement_Business_Operations_02172026_V2.docx",
])

copy_named(os.path.join(FD, "Core Values - Doug and TPD"), IB, [
    "TPD_File_Doug_Core_Values_02172026_V2.docx",
    "TPD_File_Doug_Core_Values_02172026_V21.docx",
    "TPD_File_DougCoreValues_02172026_V1.docx",
    "TPD_File_TPD_Core_Values_02172026_V2.docx",
    "TPD_File_TPDCoreValues_02172026_V1.docx",
])

copy_named(
    os.path.join(FD, "Identites Overall", "Business Future Growth Statement"), IB, [
        "TPD_File_FutureGrowthStatement_02172026_V2.docx",
        "TPD_FILES_IdentityStatement_FutureGrowth_02172026_V1.docx",
    ]
)

copy_named(
    os.path.join(FD, "Identites Overall", "Business Identity Statement - Business Operations"), IB, [
        "TPD_File_BusinessIdentityStatement_02172026_V2.docx",
        "TPD_File_IdentitySystem_FullExpansion_02172026_V1.docx",
        "TPD_FILES_IdentityStatement_Business_02172026_V1.docx",
        "TPD_FILES_IdentityStatement_Business_Operations_02172026_V1(1).docx",
        "TPD_FILES_IdentityStatement_Business_Operations_02172026_V1.docx",
        "TPD_FILES_IdentityStatement_Business_Operations_02172026_V2.docx",
    ]
)

copy_named(
    os.path.join(FD, "Identites Overall", "Business Performance Code"), IB, [
        "TPD_File_TitanPerformanceCode_02172026_V1.docx",
    ]
)

copy_named(
    os.path.join(FD, "Identites Overall", "Dougs Identity Statement"), IB, [
        "TPD File_DougIdentityAndFoundation_IdentityStatement_020226_v1.0.docx",
        "TPD_File_CoreIdentityStatement_02172026_V1.docx",
        "TPD_File_CoreIdentityStatement_02172026_V2.docx",
    ]
)

copy_named(
    os.path.join(AI_REVIEW, "TPD Files_Core Values_02162026_V1.docx"), IB, [
        "CORE VALUE QUOTE SHEET - Famous Authors Page.docx",
        "CORE VALUE QUOTE SHEET 1.docx",
        "CORE VALUE QUOTE SHEET Famous Authors.docx",
        "CORE VALUE QUOTE SHEET Page.docx",
        "CORE VALUE QUOTE SHEET.docx",
        "Doug Core Values Page - Early On.docx",
        "Doug CORE VALUES.docx",
        "G R E A T N E S S flow chart.docx",
        "QUOTE SHEET.docx",
        "QUOTES TO LIVE BY.docx",
    ]
)

copy_named(
    os.path.join(AI_REVIEW, "TPD Files_Identities_02162026_V1.docx"), IB, [
        "Foundation Box Page.docx",
        "Identity Statement - Early On Page.docx",
        "Identity Statement Final.docx",
        "Identity System - Extended Sections Page.docx",
        "Identity System - Full Expansion Page.docx",
        "Identity System Extended Sections.docx",
        "Identity System.docx",
        "TITAN PERSONAL DEVELOPMENT - Overall Identity Statement Page - New.docx",
    ]
)

copy_named(
    os.path.join(AI_REVIEW, "TPD Files_Niche_02162026_V1.docx"), IB, [
        "Titan Personal Development Niche Page.docx",
        "TPC - Titan Performance Code - Brand Sheet.docx",
    ]
)

copy_all_files(
    os.path.join(GF, "TPD Files_Rules and Satments_02162026_V1.docx"), IB
)

copy_all_files(
    os.path.join(GF, "TPD Files_Taglines_02162026_V1.docx"), IB
)

copy_all_files(
    os.path.join(GF, "TPD Files_Tiers_02162026_V1.docx"), IB
)


# ─── SECTION 4: FRAMEWORK AND SYSTEM ─────────────────────────────────────────

for subfolder in [
    "TPD Files_DOP and PIT_02162026_V1.docx",
    "TPD Files_General Framework_02162026_V1.docx",
    "TPD Files_Other Process Forms_02162026_V1.docx",
    "TPD Files_-The Role of_02162026_V1.docx",
    "TPD Files_Operations_02162026_V1.docx",
    "TPD Files_Vault_02162026_V1.docx",
    "TPD Files_Client_02162026_V1.docx",
]:
    copy_all_files(os.path.join(GF, subfolder), FS)


# ─── SECTION 5: AI AND TECHNOLOGY ────────────────────────────────────────────

AI_PRI = os.path.join(LEGACY, "TPD-SYS-DOC-AIPrimers-ARC-v1.0")
COPILOT_UL = os.path.join(LEGACY, "TPD-SYS-REF-CopilotChatOutputs-ARC-v1.0",
                           "Copilot Notebook Uploads")

# Double-extension files — try clean name first, fall back to .docx.docx
for clean_name, double_name in [
    ("TPD-BUS-DOC-AIPlatformUsageAccount-ARC-v1.1.docx",
     "TPD-BUS-DOC-AIPlatformUsageAccount-ARC-v1.1.docx.docx"),
    ("TPD-BUS-DOC-BoardRoomMembersAIIntegration-ARC-v1.0.docx",
     "TPD-BUS-DOC-BoardRoomMembersAIIntegration-ARC-v1.0.docx.docx"),
]:
    clean_src = os.path.join(LEGACY, clean_name)
    double_src = os.path.join(LEGACY, double_name)
    if os.path.isfile(clean_src):
        copy_to(clean_src, AT)
    elif os.path.isfile(double_src):
        copy_to(double_src, AT, clean_name)
    else:
        print(f"  ERROR: not found (tried clean + double ext): {clean_name}")
        counts["errors"] += 1

copy_named(AI_PRI, AT, [
    "MASTER  AI PRIMERS across all platforms.docx",
])

copy_named(os.path.join(AI_PRI, "Chat GPT Files"), AT, [
    "TPD Start up Guide CHAT GPT.docx",
])

copy_named(os.path.join(AI_PRI, "Claude AI Files", "New folder"), AT, [
    "#0_PRIMING_PROCESS_FLOW_GUIDE - CAI Priming Workflow Checklist.docx",
    "CAI Chat 1 Primer for next - #1_02162026_document_upload_workflow_process.docx",
])

# Copilot Notebook Uploads — copy wanted files, skip superseded ones
COPILOT_COPY = [
    "AI INTERGRATION OVERALL SET UP LIST OF THREADS TO COMBINE.docx",
    "CLADUE AI WORKFLOW Artifacts and Knowledge Base - How To - FOR JPG.docx",
    "Doug's Daily Weekly Routine Prompt.docx",
    "Handboon For AI Setup across All Platforms and Intergration of JPG Business Stragety.docx",
    "JPG MASTER CONTEXT DOCUMENT - Primer for new Chats within Projects.docx",
    "JPG OPERATIONAL EXECUTION HANDBOOK v1.docx",
    "My computers - Tech layout and AI interface.docx",
    "Perplexity Run down on JPG BoardRoom Set Up.docx",
    "Text list of Docs to upload to CHat GPT for review for OVERALL Guide 04222026.docx",
    "TO SET UP ONEDRIVE CONNECTOR TO CLADUE.docx",
]

for name in COPILOT_COPY:
    copy_to(os.path.join(COPILOT_UL, name), AT)

for name in sorted(SKIP_SET):
    skip(name, "superseded or already in ODB")


# ─── SECTION 6: GENERAL REFERENCE ────────────────────────────────────────────

BUILDING = os.path.join(AI_REVIEW, "TPD Files_Building the Business_02162026_V1.docx")
GEN_DOCS = os.path.join(LEGACY, "TPD-BUS-DOC-GeneralDocuments-ARC-v1.0")

copy_all_files(BUILDING, GR)

copy_named(GF, GR, [
    "EXAMPLE  FILE EMPTY - [FolderName]_[DocumentName]_[DATE]_v[VERSION].docx",
])

copy_all_files(os.path.join(GF, "TPD Files_Excel_02162026_V1.docx"), GR)
copy_all_files(os.path.join(GF, "TPD Files_Other_02162026_V1.docx"),  GR)
copy_all_files(os.path.join(GF, "TPD Files_Other2_02162026_V1.docx"), GR)

copy_named(GEN_DOCS, GR, [
    "JONES PERFORMANCE GROUP - Folder Front Page.docx",
])


# ─── SUMMARY ─────────────────────────────────────────────────────────────────

print()
print("--- SUMMARY ---")
print(f"Files copied:       {counts['copied']}")
print(f"Files skipped:      {counts['skipped']}")
print(f"Duplicates renamed: {counts['dupes']}")
print(f"Errors:             {counts['errors']}")
