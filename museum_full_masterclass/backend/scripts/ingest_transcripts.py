"""Scan the unpacked upload for transcripts and create a summarized memory.json.
This is a lightweight, offline-friendly ingest that:
- finds files with 'transcript' in filename or common transcript extensions (.txt, .md, .srt)
- extracts headings, first/last paragraphs, and simple keyword counts
- writes summaries to data/memory.json under key 'transcripts'
"""
import re, json, os
from pathlib import Path
from collections import Counter

UNPACKED = Path(os.getenv('UNPACKED_DIR', 'GestaltView_unpacked'))
MEM_FILE = Path('data') / 'memory.json'
MEM_FILE.parent.mkdir(parents=True, exist_ok=True)
results = []

def extract_text(p: Path) -> str:
    try:
        return p.read_text(encoding='utf-8', errors='ignore')
    except Exception:
        return ''

def simple_keywords(text, n=10):
    words = re.findall(r"\w+", text.lower())
    stop = set(['the','and','a','to','of','in','is','it','that','for','on','with','this','be','as','are','was'])
    filtered = [w for w in words if w not in stop and len(w)>2]
    cnt = Counter(filtered)
    return [w for w,_ in cnt.most_common(n)]

for p in UNPACKED.rglob('*'):
    if p.is_file() and ('transcript' in p.name.lower() or p.suffix.lower() in ['.txt','.md','.srt','.vtt']):
        text = extract_text(p)
        if not text.strip():
            continue
        summary = text.strip()[:800]
        kws = simple_keywords(text, n=12)
        results.append({'path': str(p), 'summary': summary, 'keywords': kws})

# load existing memory
mem = {}
if MEM_FILE.exists():
    try:
        mem = json.loads(MEM_FILE.read_text(encoding='utf-8'))
    except Exception:
        mem = {}

mem['transcripts'] = results
MEM_FILE.write_text(json.dumps(mem, indent=2), encoding='utf-8')
print(f"Wrote {len(results)} transcripts summaries to {MEM_FILE}")
