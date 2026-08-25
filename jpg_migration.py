import os
import shutil

DRY_RUN = False

BASE = r"C:\Fileorganization-onedrive-personal and business"
SRC_ROOT = os.path.join(BASE, "JPG Onedrive Personal", "JPG - Jones Performance Group Stuff")
DST_ROOT = os.path.join(BASE, "JPG Onedrive Business", "JPG MASTER")

STAGING    = os.path.join(SRC_ROOT, "Files and Folder to be moved to One Drive Business (Stagging)")
AI_DATA    = os.path.join(SRC_ROOT, "AI DATA Room Docs")
AI_DATA_FI = os.path.join(SRC_ROOT, "AI DATA Room Docs", "Foundation and Identity")
DATA_ROOM_1 = os.path.join(SRC_ROOT, "Items for AI Data Room #1")
TRAINING   = os.path.join(SRC_ROOT, "Training Plans and Fitness")

def s(folder, filename):
    return os.path.join(folder, filename)

def d(rel_path):
    return os.path.join(DST_ROOT, rel_path)

COPY_OPERATIONS = [
    # ── JPG System\Standards\ (active) ──────────────────────────────────────
    (s(STAGING, "JPG-SYS-CS-CoreStandard-WRK-v1.8.docx"),
     d(r"JPG System\Standards\JPG-SYS-CS-CoreStandard-WRK-v1.8.docx")),

    (s(STAGING, "JPG-SYS-SOP-GoverningFileList-WRK-v2_3.docx"),
     d(r"JPG System\Standards\JPG-SYS-SOP-GoverningFileList-WRK-v2.3.docx")),

    (s(STAGING, "JPG-SYS-DOC-DocStructurePrimer-WRK-v1.6.docx"),
     d(r"JPG System\Standards\JPG-SYS-DOC-DocStructurePrimer-WRK-v1.6.docx")),

    (s(STAGING, "JPG-SYS-DOC-DOP4x4Matrix-WRK-v1.0 (4).docx"),
     d(r"JPG System\Standards\JPG-SYS-DOC-DOP4x4Matrix-WRK-v1.0.docx")),

    # ── JPG System\Standards\Archive\ (new) ─────────────────────────────────
    (s(STAGING, "JPG-SYS-CS-CoreStandard-WRK-v1.5.docx"),
     d(r"JPG System\Standards\Archive\JPG-SYS-CS-CoreStandard-WRK-v1.5.docx")),

    (s(STAGING, "JPG-SYS-CS-CoreStandard-WRK-v1.6.docx"),
     d(r"JPG System\Standards\Archive\JPG-SYS-CS-CoreStandard-WRK-v1.6.docx")),

    (s(STAGING, "JPG-SYS-CS-CoreStandard-WRK-v1.7 (5).docx"),
     d(r"JPG System\Standards\Archive\JPG-SYS-CS-CoreStandard-WRK-v1.7.docx")),

    (s(STAGING, "JPG-SYS-SOP-GoverningFileList-WRK-v1.4.docx"),
     d(r"JPG System\Standards\Archive\JPG-SYS-SOP-GoverningFileList-WRK-v1.4.docx")),

    (s(STAGING, "JPG-SYS-SOP-GoverningFileList-WRK-v1.5.docx"),
     d(r"JPG System\Standards\Archive\JPG-SYS-SOP-GoverningFileList-WRK-v1.5.docx")),

    (s(STAGING, "JPG-SYS-SOP-GoverningFileList-WRK-v1.6 (1).docx"),
     d(r"JPG System\Standards\Archive\JPG-SYS-SOP-GoverningFileList-WRK-v1.6a.docx")),

    (s(STAGING, "JPG-SYS-SOP-GoverningFileList-WRK-v1.6.docx"),
     d(r"JPG System\Standards\Archive\JPG-SYS-SOP-GoverningFileList-WRK-v1.6b.docx")),

    (s(STAGING, "JPG-SYS-SOP-GoverningFileList-WRK-v2_0.docx"),
     d(r"JPG System\Standards\Archive\JPG-SYS-SOP-GoverningFileList-WRK-v2.0.docx")),

    (s(STAGING, "JPG-SYS-SOP-GoverningFileList-WRK-v2.2.docx"),
     d(r"JPG System\Standards\Archive\JPG-SYS-SOP-GoverningFileList-WRK-v2.2.docx")),

    (s(STAGING, "JPG-SYS-DOC-DocumentStructurePrimer-WRK-v1_3 (1).docx"),
     d(r"JPG System\Standards\Archive\JPG-SYS-DOC-DocStructurePrimer-WRK-v1.3.docx")),

    (s(STAGING, "JPG-SYS-DOC-DocStructurePrimer-WRK-v1.4.docx"),
     d(r"JPG System\Standards\Archive\JPG-SYS-DOC-DocStructurePrimer-WRK-v1.4.docx")),

    (s(STAGING, "JPG-SYS-DOC-DocStructurePrimer-WRK-v1.5 (1).docx"),
     d(r"JPG System\Standards\Archive\JPG-SYS-DOC-DocStructurePrimer-WRK-v1.5.docx")),

    # ── JPG System\Playbooks\JPG PB FIN docs\Archive\ (new) ─────────────────
    (s(STAGING, "JPG-SYS-PB-11-BackendInfrastructure-WRK-v2.2.docx"),
     d(r"JPG System\Playbooks\JPG PB FIN docs\Archive\JPG-SYS-PB-11-BackendInfrastructure-WRK-v2.2.docx")),

    (s(STAGING, "JPG-SYS-PB-14-WebsiteArchitecture-WRK-v3.2.docx"),
     d(r"JPG System\Playbooks\JPG PB FIN docs\Archive\JPG-SYS-PB-14-WebsiteArchitecture-WRK-v3.2.docx")),

    # ── JPG System\AI System\AI Data Room\ (new) ────────────────────────────
    (s(AI_DATA, "jpg-md-standard.md"),
     d(r"JPG System\AI System\AI Data Room\JPG-AI-DOC-MDStandard-WRK-v1.0.md")),

    # ── JPG System\AI System\AI Data Room\Foundation and Identity\ (new) ────
    (s(AI_DATA_FI, "jpg-brand-voice.md"),
     d(r"JPG System\AI System\AI Data Room\Foundation and Identity\jpg-brand-voice.md")),

    (s(AI_DATA_FI, "jpg-core-values.md"),
     d(r"JPG System\AI System\AI Data Room\Foundation and Identity\jpg-core-values.md")),

    (s(AI_DATA_FI, "jpg-limitless-doctrine.md"),
     d(r"JPG System\AI System\AI Data Room\Foundation and Identity\jpg-limitless-doctrine.md")),

    (s(AI_DATA_FI, "jpg-mission-vision (1).md"),
     d(r"JPG System\AI System\AI Data Room\Foundation and Identity\jpg-mission-vision.md")),

    (s(AI_DATA_FI, "jpg-owner-profile.md"),
     d(r"JPG System\AI System\AI Data Room\Foundation and Identity\jpg-owner-profile.md")),

    # ── JPG System\AI System\AI Data Room\Data Room 1\ (new) ────────────────
    (s(DATA_ROOM_1, "JPG-FD-001-EDU-FIN-v6 (4).docx"),
     d(r"JPG System\AI System\AI Data Room\Data Room 1\JPG-FD-001-EDU-FIN-v6.docx")),

    (s(DATA_ROOM_1, "JPG-FD-002-EDU-FIN-v4 (6).docx"),
     d(r"JPG System\AI System\AI Data Room\Data Room 1\JPG-FD-002-EDU-FIN-v4.docx")),

    (s(DATA_ROOM_1, "JPG-FD-003-EDU-FIN-v6 (5).docx"),
     d(r"JPG System\AI System\AI Data Room\Data Room 1\JPG-FD-003-EDU-FIN-v6.docx")),

    (s(DATA_ROOM_1, "JPG-FD-004-EDU-FIN-v5 (4).docx"),
     d(r"JPG System\AI System\AI Data Room\Data Room 1\JPG-FD-004-EDU-FIN-v5.docx")),

    (s(DATA_ROOM_1, "JPG-FD-OV-001-EDU-FIN-v6 (5).docx"),
     d(r"JPG System\AI System\AI Data Room\Data Room 1\JPG-FD-OV-001-EDU-FIN-v6.docx")),

    (s(DATA_ROOM_1, "JPG-SYS-CS-CoreStandard-FIN-v1.4.docx"),
     d(r"JPG System\AI System\AI Data Room\Data Room 1\JPG-SYS-CS-CoreStandard-FIN-v1.4.docx")),

    (s(DATA_ROOM_1, "JPG_Client_Disclaimer_v2.docx"),
     d(r"JPG System\AI System\AI Data Room\Data Room 1\JPG-BUS-DOC-ClientDisclaimer-WRK-v2.0.docx")),

    (s(DATA_ROOM_1, "WHY you should choose me.docx"),
     d(r"JPG System\AI System\AI Data Room\Data Room 1\JPG-BUS-DOC-WhyChooseJPG-WRK-v1.0.docx")),

    # ── JPG System\AI System\AI Primer System\Active\ ───────────────────────
    (s(STAGING, "JPG-SYS-PRIMER-MasterPrimer-WRK-v3.0 (4).docx"),
     d(r"JPG System\AI System\AI Primer System\Active\JPG-SYS-PRIMER-MasterPrimer-WRK-v3.0.docx")),

    (s(STAGING, "JPG-StatusPrimer-05312026.md"),
     d(r"JPG System\AI System\AI Primer System\Active\JPG-SYS-DOC-StatusPrimer-ARC-v1.0.md")),

    (s(STAGING, "JPG-SYS-DOC-MigrationToCAIDesktopCode-WRK-v1.0.pdf"),
     d(r"JPG System\AI System\AI Primer System\Active\JPG-SYS-DOC-MigrationToCAIDesktopCode-WRK-v1.0.pdf")),

    (s(STAGING, "CAI DESKTOP CODE OPERATING MANUAL (Markdown not formal doc yet).docx"),
     d(r"JPG System\AI System\AI Primer System\Active\JPG-SYS-DOC-CAIDesktopCodeManual-WRK-v1.0.docx")),

    (s(STAGING, "JPG-HowtoOpenAppsLocalCheatSheet.md"),
     d(r"JPG System\AI System\AI Primer System\Active\JPG-SYS-DOC-AppsLocalCheatSheet-WRK-v1.0.md")),

    (s(STAGING, "JPG-SYS-4x4-CodeLogic-WRK-v1_6.md"),
     d(r"JPG System\AI System\AI Primer System\Active\JPG-SYS-DOC-4x4CodeLogic-WRK-v1.6.md")),

    (s(STAGING, "JPG-SYS-Apps-TroubleshootingGuide-WRK-v3_2.md"),
     d(r"JPG System\AI System\AI Primer System\Active\JPG-SYS-DOC-TroubleshootingGuide-ARC-v3.2.md")),

    # ── JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\
    (s(STAGING, "JPG-FD-001-EDU-WRK-v1.0.docx"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-FD-001-EDU-WRK-v1.0.docx")),

    (s(STAGING, "JPG-FD-001-EDU-WRK-v1.0.pdf"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-FD-001-EDU-WRK-v1.0.pdf")),

    (s(STAGING, "JPG-FD-002-EDU-WRK-v1.0.docx"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-FD-002-EDU-WRK-v1.0.docx")),

    (s(STAGING, "JPG-FD-002-EDU-WRK-v1.0.pdf"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-FD-002-EDU-WRK-v1.0.pdf")),

    (s(STAGING, "JPG-FD-003-EDU-WRK-v1.0.docx"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-FD-003-EDU-WRK-v1.0.docx")),

    (s(STAGING, "JPG-FD-003-EDU-WRK-v1.0.pdf"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-FD-003-EDU-WRK-v1.0.pdf")),

    (s(STAGING, "JPG-FD-004-EDU-WRK-v1.0.docx"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-FD-004-EDU-WRK-v1.0.docx")),

    (s(STAGING, "JPG-FD-004-EDU-WRK-v1.0.pdf"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-FD-004-EDU-WRK-v1.0.pdf")),

    (s(STAGING, "JPG-FD-005-EDU-WhatIsPIT-WRK-v1.0 (2).docx"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-FD-005-EDU-WhatIsPIT-WRK-v1.0.docx")),

    (s(STAGING, "JPG-FD-005-EDU-WhatIsPIT-v1.0.pdf"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-FD-005-EDU-WhatIsPIT-WRK-v1.0.pdf")),

    (s(STAGING, "JPG-FD-006-EDU-WhatIsDOP-WRK-v1.0 (2).docx"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-FD-006-EDU-WhatIsDOP-WRK-v1.0.docx")),

    (s(STAGING, "JPG-FD-006-EDU-WhatIsDOP-v1.0.pdf"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-FD-006-EDU-WhatIsDOP-WRK-v1.0.pdf")),

    (s(STAGING, "JPG-FD-007-EDU-PITandDOPIntegrated-WRK-v1.0 (2).docx"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-FD-007-EDU-PITandDOPIntegrated-WRK-v1.0.docx")),

    (s(STAGING, "JPG-FD-007-EDU-PITandDOPIntegrated-v1.0.pdf"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-FD-007-EDU-PITandDOPIntegrated-WRK-v1.0.pdf")),

    (s(STAGING, "JPG-FD-009-EDU-DOP4x4Matrix-WRK-v1.0 (1).docx"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-FD-009-EDU-DOP4x4Matrix-WRK-v1.0.docx")),

    (s(STAGING, "JPG-FD-009-EDU-DOP4x4Matrix-v1.0.pdf"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-FD-009-EDU-DOP4x4Matrix-WRK-v1.0.pdf")),

    (s(STAGING, "JPG-FD-010-EDU-MeasuringEffort-WRK-v1.0.docx"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-FD-010-EDU-MeasuringEffort-WRK-v1.0.docx")),

    (s(STAGING, "JPG-FD-010-EDU-MeasuringEffort-v1.0.pdf"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-FD-010-EDU-MeasuringEffort-WRK-v1.0.pdf")),

    (s(STAGING, "JPG-FD-LIM-001-EDU-WRK-v1.0 (1).docx"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-FD-LIM-001-EDU-WRK-v1.0.docx")),

    (s(STAGING, "JPG-FD-LIM-001-EDU-WRK-v1.0.pdf"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-FD-LIM-001-EDU-WRK-v1.0.pdf")),

    (s(STAGING, "JPG-FD-OV-001-EDU-WRK-v1.0.docx"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-FD-OV-001-EDU-WRK-v1.0.docx")),

    (s(STAGING, "JPG-FD-OV-001-EDU-WRK-v1.0.pdf"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-FD-OV-001-EDU-WRK-v1.0.pdf")),

    (s(STAGING, "JPG-FD-PHYEFFORT-001-EDU-WRK-v1.0.docx"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-FD-PHYEFFORT-001-EDU-WRK-v1.0.docx")),

    (s(STAGING, "JPG-EDU-CellPhoneRelationship-WRK-v1.0 (1).docx"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-EDU-CellPhoneRelationship-WRK-v1.0.docx")),

    (s(STAGING, "JPG-EDU-CellPhoneRelationship-v1.0.pdf"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-EDU-CellPhoneRelationship-WRK-v1.0.pdf")),

    (s(STAGING, "JPG-TK-001-ClientApplication-WRK-v2.0 (1).pdf"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-TK-001-ClientApplication-WRK-v2.0.pdf")),

    (s(STAGING, "JPG-TK-002-ProgramOverview-WRK-v2.0.pdf"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-TK-002-ProgramOverview-WRK-v2.0.pdf")),

    (s(STAGING, "JPG-TK-004-ProgramAgreement-WRK-v1.0 (1).pdf"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-TK-004-ProgramAgreement-WRK-v1.0.pdf")),

    (s(STAGING, "JPG-TK-005-PhotoRelease-WRK-v1.0 (2).pdf"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Finals\JPG-TK-005-PhotoRelease-WRK-v1.0.pdf")),

    # ── JPG Business\Offerings and Strategy\Products\Foundation Forms\Archive\
    (s(STAGING, "JPG-FD-001-EDU-v3_Foundation01_Fitness_ARC.docx"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Archive\JPG-FD-001-EDU-ARC-v3.docx")),

    # ── JPG Business\Offerings and Strategy\Products\Foundation Forms\Drafts\
    (s(STAGING, "Examples of Foundation Core protocols.docx"),
     d(r"JPG Business\Offerings and Strategy\Products\Foundation Forms\Drafts\JPG-BUS-DOC-FoundationCoreExamples-WRK-v1.0.docx")),

    # ── JPG Business\Offerings and Strategy\Products\14 Day tracking\ ────────
    (s(STAGING, "JPG-PROJ-TK-001-14DayTracking-WRK-v29.docx"),
     d(r"JPG Business\Offerings and Strategy\Products\14 Day tracking\JPG-PROJ-TK-001-14DayTracking-WRK-v29.docx")),

    # ── JPG Business\Mission\Core\ ───────────────────────────────────────────
    (s(STAGING, "JPG-BUS-DOC-Ephesians320LIMITLESS-WRK-v1.0 (1).docx"),
     d(r"JPG Business\Mission\Core\JPG-BUS-DOC-Ephesians320LIMITLESS-WRK-v1.0.docx")),

    (s(STAGING, "JPG-BUS-DOC-BusinessDevMaster-WRK-v1.0.docx"),
     d(r"JPG Business\Mission\Core\JPG-BUS-DOC-BusinessDevMaster-WRK-v1.0.docx")),

    # ── JPG Business\Mission\Positioning\ ───────────────────────────────────
    (s(DATA_ROOM_1, "WHY you should choose me.docx"),
     d(r"JPG Business\Mission\Positioning\JPG-BUS-DOC-WhyChooseJPG-WRK-v1.0.docx")),

    # ── JPG Business\Brand\Logo\ ─────────────────────────────────────────────
    (s(STAGING, "LIMITL1_transparent.png"),
     d(r"JPG Business\Brand\Logo\JPG-BUS-DOC-LogoLIMITLESS-Tier1-Transparent-FIN-v1.0.png")),

    # ── JPG Business\Operations\ (active) ───────────────────────────────────
    (s(STAGING, "JPG-BUS-DOC-AppBlueprintBrainstorm-WRK-v4.0 (1).docx"),
     d(r"JPG Business\Operations\JPG-BUS-DOC-AppBlueprintBrainstorm-WRK-v4.0.docx")),

    # ── JPG Business\Operations\Archive\ (new) ──────────────────────────────
    (s(STAGING, "JPG-BUS-DOC-AppBlueprintBrainstorm-WRK-v1.0.docx"),
     d(r"JPG Business\Operations\Archive\JPG-BUS-DOC-AppBlueprintBrainstorm-WRK-v1.0.docx")),

    # ── JPG Projects\Personal Performance\ (new) ────────────────────────────
    (s(TRAINING, "JPG-PROJ-DOC-50MUltraTrainingPlan-TP001-WRK-v1.1.docx"),
     d(r"JPG Projects\Personal Performance\JPG-PROJ-DOC-50MUltraTrainingPlan-TP001-WRK-v1.1.docx")),

    (s(TRAINING, "JPG-PROJ-DOC-50MUltraTrainingPlan-TP001-WRK-v1.0.pdf"),
     d(r"JPG Projects\Personal Performance\JPG-PROJ-DOC-50MUltraTrainingPlan-TP001-WRK-v1.0.pdf")),

    (s(TRAINING, "JPG-PROJ-DOC-SupplementStackDailyNutrition-WRK-v1.5.docx"),
     d(r"JPG Projects\Personal Performance\JPG-PROJ-DOC-SupplementStackDailyNutrition-WRK-v1.5.docx")),

    (s(TRAINING, "JPG-PROJ-DOC-WeeklyScheduler-Runs-TP001-WRK-v1.7.docx"),
     d(r"JPG Projects\Personal Performance\JPG-PROJ-DOC-WeeklyScheduler-Runs-TP001-WRK-v1.7.docx")),

    (s(TRAINING, "JPG-PROJ-DOC-TredictMetricRef-WRK-v1.0 (1).docx"),
     d(r"JPG Projects\Personal Performance\JPG-PROJ-DOC-TredictMetricRef-WRK-v1.0.docx")),

    (s(TRAINING, "Tredict_Master_Reference_v6.docx"),
     d(r"JPG Projects\Personal Performance\JPG-PROJ-DOC-TredictMasterRef-WRK-v6.0.docx")),

    # ── JPG Projects\Personal Performance\Archive\ (new) ────────────────────
    (s(TRAINING, "JPG-PROJ-DOC-50MUltraTrainingPlan-TP001-WRK-v1.0.docx"),
     d(r"JPG Projects\Personal Performance\Archive\JPG-PROJ-DOC-50MUltraTrainingPlan-TP001-WRK-v1.0.docx")),

    (s(TRAINING, "JPG-PROJ-DOC-50MUltraTrainingPlan-TP001-WRK-v1_1.docx"),
     d(r"JPG Projects\Personal Performance\Archive\JPG-PROJ-DOC-50MUltraTrainingPlan-TP001-WRK-v1.1-dupe.docx")),

    (s(TRAINING, "JPG-PROJ-DOC-SupplementStack-WRK-v1.0 (6).docx"),
     d(r"JPG Projects\Personal Performance\Archive\JPG-PROJ-DOC-SupplementStack-WRK-v1.0.docx")),

    (s(TRAINING, "JPG-PROJ-DOC-SupplementStack-WRK-v1.2.docx"),
     d(r"JPG Projects\Personal Performance\Archive\JPG-PROJ-DOC-SupplementStack-WRK-v1.2.docx")),

    (s(TRAINING, "JPG-PROJ-DOC-WeeklyScheduler-Runs-TP001-WRK-v1.0.docx"),
     d(r"JPG Projects\Personal Performance\Archive\JPG-PROJ-DOC-WeeklyScheduler-Runs-TP001-WRK-v1.0.docx")),

    (s(TRAINING, "JPG-PROJ-DOC-WeeklyScheduler-Runs-TP001-WRK-v1.2 (1).docx"),
     d(r"JPG Projects\Personal Performance\Archive\JPG-PROJ-DOC-WeeklyScheduler-Runs-TP001-WRK-v1.2.docx")),

    (s(TRAINING, "JPG-PROJ-DOC-WeeklyScheduler-Runs-TP001-WRK-v1.3.docx"),
     d(r"JPG Projects\Personal Performance\Archive\JPG-PROJ-DOC-WeeklyScheduler-Runs-TP001-WRK-v1.3.docx")),

    (s(TRAINING, "JPG-PROJ-DOC-WeeklyScheduler-Runs-TP001-WRK-v1.4.docx"),
     d(r"JPG Projects\Personal Performance\Archive\JPG-PROJ-DOC-WeeklyScheduler-Runs-TP001-WRK-v1.4.docx")),
]

SKIP_ENTRIES = [
    ("Downloads\\",                                              "excluded per migration rules"),
    ("JPG DOP App Creation docs\\",                             "excluded per migration rules"),
    ("JPG PIT App Creation docs\\",                             "excluded per migration rules"),
    ("JPG HUB App Creation docs\\",                             "excluded per migration rules"),
    ("JPG 14 - Day Tracking Onboarding App Info\\",             "excluded per migration rules"),
    ("Files and Filders to be stored on LOCAL (APP Stagging related)\\", "stays local"),
    ("Files and Folders that have been moved to One Drive Business\\",   "reference only"),
    ("STAGING\\JPG-FD-LIM-001-EDU-WRK-v1.0.docx",             "duplicate of (1) version, only one needed"),
]


def rel_src(path):
    try:
        return os.path.relpath(path, SRC_ROOT)
    except ValueError:
        return path

def rel_dst(path):
    try:
        return os.path.relpath(path, DST_ROOT)
    except ValueError:
        return path


def run():
    mode = "DRY RUN" if DRY_RUN else "LIVE RUN"
    print(f"=== {mode} ===")
    print(f"SOURCE: {SRC_ROOT}")
    print(f"TARGET: {DST_ROOT}")
    print()

    folders_created = 0
    files_copied = 0
    files_skipped = 0
    errors = []
    seen_dirs = set()

    # Print skips first
    for entry, reason in SKIP_ENTRIES:
        print(f"SKIP: {entry} -- {reason}")
        files_skipped += 1
    print()

    # Process copy operations
    for src, dst in COPY_OPERATIONS:
        dst_dir = os.path.dirname(dst)

        # Create destination directory if needed
        if dst_dir not in seen_dirs:
            if not os.path.isdir(dst_dir):
                print(f"MKDIR: {rel_dst(dst_dir)}")
                if not DRY_RUN:
                    try:
                        os.makedirs(dst_dir, exist_ok=True)
                    except Exception as e:
                        errors.append(f"MKDIR failed: {dst_dir} -- {e}")
                        continue
                folders_created += 1
            seen_dirs.add(dst_dir)

        # Verify source exists
        if not os.path.isfile(src):
            msg = f"SOURCE NOT FOUND: {rel_src(src)}"
            print(f"ERROR: {msg}")
            errors.append(msg)
            continue

        print(f"COPY: {rel_src(src)} --> {rel_dst(dst)}")
        if not DRY_RUN:
            try:
                shutil.copy2(src, dst)
            except Exception as e:
                errors.append(f"COPY failed: {src} -> {dst} -- {e}")
                continue
        files_copied += 1

    # Summary
    print()
    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Folders created : {folders_created}")
    print(f"Files copied    : {files_copied}")
    print(f"Files skipped   : {files_skipped}")
    print(f"Errors          : {len(errors)}")
    if errors:
        print()
        print("ERROR DETAILS:")
        for e in errors:
            print(f"  - {e}")
    print("=" * 60)


if __name__ == "__main__":
    run()
