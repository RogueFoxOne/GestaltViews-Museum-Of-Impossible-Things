from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from context_sources import (
    DEFAULT_CONTEXT_BUNDLES,
    get_bundle_paths,
)


@dataclass(frozen=True)
class LoomModule:
    key: str
    label: str
    context_targets: tuple[str, ...]
    loom_pass_focus: str
    bucket_drop_tags: tuple[str, ...]


MODULE_CONTEXT_MAP: dict[str, LoomModule] = {
    "foundation": LoomModule(
        key="foundation",
        label="Stage 0 · Environment & Safety",
        context_targets=("module0_basic_profile", "module11_language_key"),
        loom_pass_focus="Calibrate environment, tone, and privacy mantras before weaving",
        bucket_drop_tags=("privacy", "tone", "bucket_drop_schema"),
    ),
    "persona": LoomModule(
        key="persona",
        label="Stage 1 · Persona & PLK",
        context_targets=("module11_language_key", "module4_character_exploration"),
        loom_pass_focus="Mirror Keith's Personal Language Key cadence and cadence cues",
        bucket_drop_tags=("plk", "acknowledgement", "loom_placement"),
    ),
    "module-1": LoomModule(
        key="module-1",
        label="Module 1 · Collaborator Customization",
        context_targets=("module1_core_identity_values",),
        loom_pass_focus="Lock collaborator settings and confirm preferences",
        bucket_drop_tags=("persona_prefs", "emoji_policy"),
    ),
    "module-2": LoomModule(
        key="module-2",
        label="Module 2 · Life Experiences & Skills",
        context_targets=("module2_experiences_learnings", "module3_skills_knowledge_resume"),
        loom_pass_focus="Capture STAR stories and ADHD strengths",
        bucket_drop_tags=("wow_moments", "skills_used", "challenges"),
    ),
    "module-3": LoomModule(
        key="module-3",
        label="Module 3 · Character & Values",
        context_targets=("module4_character_exploration", "module5_character_in_action"),
        loom_pass_focus="Map adversity to values and coping strategies",
        bucket_drop_tags=("fire_actions", "values", "lessons"),
    ),
    "module-4": LoomModule(
        key="module-4",
        label="Module 4 · Fact-Based Profiles",
        context_targets=("module3_skills_knowledge_resume", "module4_character_exploration"),
        loom_pass_focus="Synthesize skill and personality statements from lived evidence",
        bucket_drop_tags=("citations", "fact_based"),
    ),
    "module-5": LoomModule(
        key="module-5",
        label="Module 5 · Music Quest Journaling",
        context_targets=("module10_soundtrack_of_life",),
        loom_pass_focus="Link songs to emotions, memories, and workflows",
        bucket_drop_tags=("song", "lyrics", "workflow_relevance"),
    ),
    "module-6": LoomModule(
        key="module-6",
        label="Module 6 · Daily Journal",
        context_targets=("module5_character_in_action",),
        loom_pass_focus="Hold space for reflections and optional prompt surfacing",
        bucket_drop_tags=("journal", "patterns"),
    ),
    "module-7": LoomModule(
        key="module-7",
        label="Module 7 · Aspirations & Goals",
        context_targets=("module6_aspirations_goals",),
        loom_pass_focus="Transform ambitions into roadmaps tied to assets",
        bucket_drop_tags=("ambitions", "risks", "next_actions"),
    ),
    "module-8": LoomModule(
        key="module-8",
        label="Module 8 · Interests & Community",
        context_targets=("module7_relationships_connections",),
        loom_pass_focus="Suggest community nudges and hobby explorations",
        bucket_drop_tags=("community", "hobby", "opt_out"),
    ),
    "module-9": LoomModule(
        key="module-9",
        label="Module 9 · Nuances & PLK",
        context_targets=("module11_language_key",),
        loom_pass_focus="Append nuanced PLK entries with phrasing and meaning",
        bucket_drop_tags=("metaphor", "phrase", "meaning"),
    ),
    "module-10": LoomModule(
        key="module-10",
        label="Module 10 · Custom Exploration",
        context_targets=("module1_core_identity_values", "module5_character_in_action"),
        loom_pass_focus="Support user-defined frameworks while honoring Loom rituals",
        bucket_drop_tags=("custom_framework", "success_definition"),
    ),
    "integration": LoomModule(
        key="integration",
        label="Stage 3 · Integration & Snowballing",
        context_targets=("module2_experiences_learnings", "module10_soundtrack_of_life"),
        loom_pass_focus="Weave insights across modules into Journey So Far summaries",
        bucket_drop_tags=("journey_summary", "patterns"),
    ),
    "reflection": LoomModule(
        key="reflection",
        label="Stage 4 · Reflection & Reinforcement",
        context_targets=("module3_skills_knowledge_resume", "module6_aspirations_goals"),
        loom_pass_focus="Compare new reflections to exports and flag drift",
        bucket_drop_tags=("alignment", "backup_reminder"),
    ),
}


def parse_bundle_keys(argument: str | None) -> list[str]:
    if not argument:
        return DEFAULT_CONTEXT_BUNDLES.copy()
    return [key.strip() for key in argument.split(",") if key.strip()]


def load_bundle_snippets(
    bundle_keys: Iterable[str],
    *,
    max_chars_per_source: int = 1200,
) -> list[tuple[str, str]]:
    snippets: list[tuple[str, str]] = []
    for bundle_key in bundle_keys:
        for path in get_bundle_paths(bundle_key):
            excerpt = _read_excerpt(path, max_chars_per_source)
            if excerpt:
                snippets.append((path.name, excerpt))
    return snippets


def build_context_appendix(
    module_key: str,
    bundle_keys: Iterable[str],
    *,
    max_chars_per_source: int = 1200,
) -> str:
    module = MODULE_CONTEXT_MAP.get(module_key)
    parts: list[str] = []
    if module:
        targets = ", ".join(module.context_targets)
        tags = ", ".join(module.bucket_drop_tags)
        parts.append(
            f"Loom Context Targets: {targets}\n"
            f"Bucket Drop Tags: {tags}\n"
            f"Focus: {module.loom_pass_focus}"
        )
    for filename, excerpt in load_bundle_snippets(
        bundle_keys, max_chars_per_source=max_chars_per_source
    ):
        parts.append(f"Source: {filename}\n{excerpt}")
    return "\n\n".join(parts).strip()


def _read_excerpt(path: Path, max_chars: int) -> str:
    try:
        text = path.read_text(encoding="utf-8")
    except FileNotFoundError:
        return ""
    return text[:max_chars].strip()
