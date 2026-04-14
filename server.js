import express from 'express';
import Database from 'better-sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import { existsSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3003;
const DATA_DIR = process.env.DATA_DIR || '/data';
const DB_PATH = join(DATA_DIR, 'scores.db');

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.exec(`
    CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        score INTEGER NOT NULL,
        distance INTEGER NOT NULL,
        herbs INTEGER NOT NULL,
        cause TEXT NOT NULL,
        ip_hash TEXT NOT NULL,
        created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_scores_score ON scores(score DESC);
`);

const insertScore = db.prepare(
    'INSERT INTO scores (name, score, distance, herbs, cause, ip_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
);
const topScores = db.prepare(
    'SELECT name, score, distance, herbs, cause, created_at FROM scores ORDER BY score DESC, created_at ASC LIMIT ?'
);

const app = express();
app.set('trust proxy', true);
app.use(express.json({ limit: '2kb' }));

const rateLimit = new Map();
const RATE_WINDOW_MS = 5000;

function getIpHash(req) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    return createHash('sha256').update(ip).digest('hex').slice(0, 16);
}

function sanitizeName(raw) {
    if (typeof raw !== 'string') return null;
    const cleaned = raw.trim().replace(/[^\x20-\x7E]/g, '').slice(0, 16);
    if (cleaned.length < 1) return null;
    return cleaned;
}

app.post('/api/scores', (req, res) => {
    const ipHash = getIpHash(req);
    const now = Date.now();
    const lastPost = rateLimit.get(ipHash) || 0;
    if (now - lastPost < RATE_WINDOW_MS) {
        return res.status(429).json({ error: 'slow down' });
    }
    rateLimit.set(ipHash, now);

    const { name, score, distance, herbs, cause } = req.body || {};
    const cleanName = sanitizeName(name);
    const cleanScore = Number.isFinite(score) ? Math.floor(Math.max(0, Math.min(score, 10_000_000))) : null;
    const cleanDistance = Number.isFinite(distance) ? Math.floor(Math.max(0, Math.min(distance, 10_000_000))) : 0;
    const cleanHerbs = Number.isFinite(herbs) ? Math.floor(Math.max(0, Math.min(herbs, 100_000))) : 0;
    const cleanCause = cause === 'spill' || cause === 'obstacle' ? cause : 'unknown';

    if (!cleanName || cleanScore === null) {
        return res.status(400).json({ error: 'invalid payload' });
    }

    insertScore.run(cleanName, cleanScore, cleanDistance, cleanHerbs, cleanCause, ipHash, now);
    res.json({ ok: true });
});

app.get('/api/scores/top', (req, res) => {
    const limit = Math.max(1, Math.min(parseInt(req.query.limit) || 50, 100));
    const rows = topScores.all(limit);
    res.json({ scores: rows });
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use(express.static(__dirname, { index: 'index.html' }));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hold the Hooch server listening on port ${PORT}, db at ${DB_PATH}`);
});
