from __future__ import annotations

import time
from dataclasses import dataclass
from typing import Callable

from ..models.schemas import Artifact, ArtifactMetadata, CreationCornerSynthesizeRequest

def _default_synthesizer(prompt: str) -> str:
    # MVP placeholder. Swap with OpenAI/Gemini/Tribunal later.
    return prompt

@dataclass
class CreationCornerEngine:
    synthesizer: Callable[[str], str] = _default_synthesizer

    def synthesize(self, req: CreationCornerSynthesizeRequest) -> Artifact:
        start = time.time()

        title = f"Title: {req.title}\n" if req.title else ""
        constraints = f"Constraints: {req.constraints}\n" if req.constraints else ""
        inputs = "\n\n".join(
            f"- {i.text.strip()}" + (f" (markers: {', '.join(i.emotional_markers)})" if i.emotional_markers else "")
            for i in req.inputs
        )

        prompt = (
            f"{title}"
            f"Artifact Type: {req.artifact_type}\n"
            f"Style: {req.style}\n"
            f"{constraints}"
            f"Inputs:\n{inputs}\n\n"
            f"Task: Synthesize a {req.artifact_type} in a {req.style} style from the inputs."
        )

        content = self.synthesizer(prompt)
        ms = int((time.time() - start) * 1000)

        return Artifact(
            type=req.artifact_type,
            content=content,
            metadata=ArtifactMetadata(
                resonance_score=0.0,
                tribunal_consensus="unvalidated",
                plk_applied=[],
                creation_time_ms=ms,
            ),
        )
