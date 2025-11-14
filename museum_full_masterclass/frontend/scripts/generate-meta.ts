// scripts/generate-meta.ts
import fs from 'fs';
import path from 'path';

interface RoomMeta {
  slug: string;
  title: string;
  description: string;
  pdfPath?: string | null;
  codeSnippets?: string[];
  thumbnail?: string | null;
  tags?: string[];
}

const ROOT = path.join(process.cwd(), 'public', 'content', 'rooms');

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function generateMeta(folder: string): RoomMeta {
  const slug = slugify(path.basename(folder));
  const files = fs.readdirSync(folder);
  const pdf = files.find(f => f.toLowerCase().endsWith('.pdf')) || null;
  const codes = files.filter(f => /\.(js|ts|tsx|py)$/.test(f));
  const img = files.find(f => /\.(png|jpg|jpeg|webp)$/i.test(f)) || null;

  return {
    slug,
    title: path.basename(folder).replace(/[_-]+/g, ' ').replace(/\b\w/g, m => m.toUpperCase()),
    description: 'Auto-generated meta description. Update manually for better detail.',
    pdfPath: pdf ? `/content/rooms/${slug}/${pdf}` : null,
    codeSnippets: codes.map(c => `/content/rooms/${slug}/${c}`),
    thumbnail: img ? `/content/rooms/${slug}/${img}` : null,
    tags: []
  };
}

function main() {
  if (!fs.existsSync(ROOT)) {
    console.error('No rooms found.');
    process.exit(1);
  }
  for (const dir of fs.readdirSync(ROOT)) {
    const full = path.join(ROOT, dir);
    if (!fs.statSync(full).isDirectory()) continue;
    const meta = generateMeta(full);
    fs.writeFileSync(path.join(full, 'meta.json'), JSON.stringify(meta, null, 2));
    console.log('✅ Generated meta.json for', dir);
  }
}

main();
