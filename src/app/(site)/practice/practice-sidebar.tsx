'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { UserProfileData } from '@/lib/practice/types';
import { fetchUserProfile } from '@/lib/practice/api';

/* ================================================================
   PURE HELPERS — no hooks, no state
   ================================================================ */

function comboColor(multiplier: number) {
    if (multiplier >= 3.5) return { bg: 'linear-gradient(135deg, #ef4444, #f97316, #ef4444)', shadow: 'rgba(239,68,68,0.5)', glow: '#ef4444' };
    if (multiplier >= 2.0) return { bg: 'linear-gradient(135deg, #f97316, #eab308, #f97316)', shadow: 'rgba(249,115,22,0.5)', glow: '#f97316' };
    if (multiplier >= 1.5) return { bg: 'linear-gradient(135deg, #6366f1, #06b6d4, #6366f1)', shadow: 'rgba(99,102,241,0.5)', glow: '#6366f1' };
    return { bg: 'linear-gradient(135deg, #6366f1, #a855f7, #6366f1)', shadow: 'rgba(99,102,241,0.4)', glow: '#6366f1' };
}

interface StarData { id: number; x: number; y: number; size: number; opacity: number; dur: number; delay: number; }

function makeStars(count: number): StarData[] {
    const seeded: StarData[] = [];
    for (let i = 0; i < count; i++) {
        seeded.push({
            id: i,
            x: ((i * 37 + 13) % 97),        // pseudo-random 0-96
            y: ((i * 53 + 29) % 99),
            size: 1.5 + ((i * 7) % 3),       // 1.5-3.5px
            opacity: 0.3 + ((i * 11) % 6) / 10, // 0.3-0.8
            dur: 2 + ((i * 3) % 3),          // 2-4s
            delay: (i * 0.3) % 4,
        });
    }
    return seeded;
}

/* ================================================================
   CUSTOM HOOKS
   ================================================================ */

/** Count-up for integers */
function useCountUp(target: number, duration = 1200) {
    const [value, setValue] = useState(0);
    const rafRef = useRef(0);
    useEffect(() => {
        const start = performance.now();
        function tick(now: number) {
            const p = Math.min((now - start) / duration, 1);
            setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
            if (p < 1) rafRef.current = requestAnimationFrame(tick);
        }
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [target, duration]);
    return value;
}

/** Count-up for decimals (combo multiplier) */
function useCountUpDecimal(target: number, duration = 800) {
    const [value, setValue] = useState(1.0);
    const rafRef = useRef(0);
    useEffect(() => {
        const from = 1.0;
        const start = performance.now();
        function tick(now: number) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(from + (target - from) * eased);
            if (p < 1) rafRef.current = requestAnimationFrame(tick);
        }
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [target, duration]);
    return value;
}

/** 3D tilt on hover */
function useTilt(maxDeg = 4) {
    const ref = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<React.CSSProperties>({
        transition: 'transform 0.15s ease-out',
        transform: 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)',
    });

    const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = ((e.clientX - cx) / (r.width / 2)) * maxDeg;
        const dy = -((e.clientY - cy) / (r.height / 2)) * maxDeg;
        setStyle({
            transition: 'transform 0.05s ease-out',
            transform: `perspective(600px) rotateX(${dy}deg) rotateY(${dx}deg) scale(1.02)`,
        });
    }, [maxDeg]);

    const onLeave = useCallback(() => {
        setStyle({
            transition: 'transform 0.3s ease-out',
            transform: 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)',
        });
    }, []);

    return { ref, style, onMove, onLeave };
}

/* ================================================================
   XP PARTICLE BURST
   ================================================================ */
const XP_PARTICLE_COLORS = ['#06b6d4', '#6366f1', '#a855f7', '#818cf8', '#22d3ee', '#c084fc'];
const XP_PARTICLES = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    dx: Math.cos((i / 6) * Math.PI * 2) * (10 + (i % 3) * 6),
    dy: Math.sin((i / 6) * Math.PI * 2) * (10 + ((i + 1) % 3) * 6),
    color: XP_PARTICLE_COLORS[i],
}));

function XpParticleBurst() {
    const [show, setShow] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setShow(true), 300);
        const t2 = setTimeout(() => setShow(false), 900);
        return () => { clearTimeout(t); clearTimeout(t2); };
    }, []);
    if (!show) return null;
    return (
        <>
            {XP_PARTICLES.map(p => (
                <div
                    key={p.id}
                    className="cosmic-xp-particle"
                    style={{
                        '--dx': `${p.dx}px`,
                        '--dy': `${p.dy}px`,
                        background: p.color,
                    } as React.CSSProperties}
                />
            ))}
        </>
    );
}

/* ================================================================
   ELECTRIC ARC SVG (XP bar hover)
   ================================================================ */
const ARC_OFFSETS = [
    [0, -5, 4, -7, 6, -4, 0],
    [0, 3, -6, 5, -3, 7, 0],
    [0, -4, 7, -3, 5, -6, 0],
];

function ElectricArc({ index }: { index: number }) {
    const offsets = ARC_OFFSETS[index % ARC_OFFSETS.length];
    const points = Array.from({ length: 7 }, (_, i) => {
        const x = (i / 6) * 240;
        const y = 8 + offsets[(i + index * 2) % offsets.length];
        return `${x},${y}`;
    }).join(' ');

    const color = index % 2 === 0 ? '#06b6d4' : '#a855f7';

    return (
        <svg
            className={`electric-arc electric-arc-${index}`}
            style={{ animationDelay: `${index * 0.07}s` }}
            width="240" height="16"
            viewBox="0 0 240 16"
            fill="none"
        >
            <polyline
                points={points}
                stroke={color}
                strokeWidth={index === 1 ? 1.5 : 1}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
                filter={`url(#arc-glow-${index})`}
            />
            <defs>
                <filter id={`arc-glow-${index}`} x="-20%" y="-100%" width="140%" height="300%">
                    <feDropShadow dx="0" dy="0" stdDeviation="2.5"
                        floodColor={color} floodOpacity="1" />
                </filter>
            </defs>
        </svg>
    );
}

/* ================================================================
   LIGHTNING BOLT SVG
   ================================================================ */
function LightningBolt({ side, delay }: { side: 'left' | 'right'; delay: number }) {
    return (
        <svg
            className="cosmic-lightning"
            style={{
                position: 'absolute',
                [side]: side === 'left' ? '12px' : '12px',
                top: '50%',
                transform: `translateY(-50%) ${side === 'right' ? 'scaleX(-1)' : ''}`,
                animationDelay: `${delay}s`,
            }}
            width="16" height="32" viewBox="0 0 16 32" fill="none"
        >
            <path
                d="M 10 0 L 4 12 L 10 10 L 4 24 L 10 18 L 6 32"
                stroke="white" strokeWidth="1.5" fill="none"
                filter="url(#bolt-glow)"
            />
            <defs>
                <filter id="bolt-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="white" floodOpacity="0.8" />
                </filter>
            </defs>
        </svg>
    );
}

/* ================================================================
   STYLES — single const injected via <style>
   ================================================================ */
const COSMIC_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Be+Vietnam+Pro:wght@400;500;600&display=swap');

.cosmic-sidebar {
    --bg-card: #0f1729;
    --bg-card-2: #141e35;
    --border: rgba(99,102,241,0.2);
    --accent: #6366f1;
    --accent-glow: rgba(99,102,241,0.4);
    --gold: #f59e0b;
    --emerald: #10b981;
    --text-primary: #f1f5f9;
    --text-muted: #64748b;
    font-family: 'Be Vietnam Pro', sans-serif;
    position: relative;
}

.cosmic-sidebar .font-outfit {
    font-family: 'Outfit', sans-serif;
}

/* ---- Entry animation (upgraded with blur) ---- */
@keyframes cosmic-enter {
    from { opacity: 0; transform: translateX(30px); filter: blur(4px); }
    to   { opacity: 1; transform: translateX(0);    filter: blur(0); }
}

.cosmic-card {
    animation: cosmic-enter 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* ---- Shimmer skeleton ---- */
@keyframes cosmic-shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}

.cosmic-skeleton {
    background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
    background-size: 200% 100%;
    animation: cosmic-shimmer 1.5s ease-in-out infinite;
    border-radius: 8px;
}

/* ---- Avatar multi-layer aura ---- */
@keyframes cosmic-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}

.avatar-wrapper {
    position: relative;
    width: 72px;
    height: 72px;
    flex-shrink: 0;
}

.aura-outer {
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    background: conic-gradient(#6366f1, #a855f7, #06b6d4, #f59e0b, #6366f1);
    animation: cosmic-spin 6s linear infinite;
    filter: blur(8px);
    opacity: 0.6;
}

.aura-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    padding: 3px;
    background: conic-gradient(#06b6d4, #6366f1, #a855f7, #06b6d4);
    animation: cosmic-spin 3s linear infinite reverse;
}

.aura-inner {
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    background: var(--bg-card);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* ---- Level badge pulse ---- */
@keyframes cosmic-level-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.5); }
    50%      { box-shadow: 0 0 12px 4px rgba(99,102,241,0.3); }
}

.cosmic-level-badge {
    animation: cosmic-level-pulse 2s ease-in-out infinite;
}

/* ---- XP bar shimmer ---- */
@keyframes cosmic-xp-shimmer {
    0%   { background-position: -100% 0; }
    100% { background-position: 200% 0; }
}

.cosmic-xp-fill {
    background: linear-gradient(90deg, #6366f1, #06b6d4, #a855f7, #6366f1);
    background-size: 200% 100%;
    position: relative;
    overflow: hidden;
}

.cosmic-xp-fill::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%);
    background-size: 200% 100%;
    animation: cosmic-xp-shimmer 2s ease-in-out infinite;
}

/* XP track grid */
.cosmic-xp-track {
    background: repeating-linear-gradient(
        90deg, rgba(99,102,241,0.05) 0px, rgba(99,102,241,0.05) 1px,
        transparent 1px, transparent 8px
    );
}

/* XP particle burst */
@keyframes cosmic-xp-burst {
    0%   { opacity: 1; transform: translate(0,0) scale(1); }
    100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0); }
}

.cosmic-xp-particle {
    position: absolute;
    right: 0;
    top: 50%;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    animation: cosmic-xp-burst 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    pointer-events: none;
}

/* ---- Glass card ---- */
.cosmic-glass {
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
}

/* ---- Fire pulse + sparks ---- */
@keyframes cosmic-fire-pulse {
    0%, 100% { transform: scale(1); }
    50%      { transform: scale(1.2); }
}

.cosmic-fire-wrap {
    position: relative;
    display: inline-block;
}

.cosmic-fire-emoji {
    display: inline-block;
    animation: cosmic-fire-pulse 1.5s ease infinite;
}

@keyframes spark-rise {
    0%   { opacity: 0.8; transform: translateY(0) scale(1); }
    100% { opacity: 0;   transform: translateY(-12px) scale(0.3); }
}

.cosmic-spark {
    position: absolute;
    bottom: 2px;
    left: 4px;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #f59e0b;
    animation: spark-rise 0.8s ease-out infinite;
    pointer-events: none;
}

.cosmic-spark-2 { animation-delay: 0.2s; left: 7px; background: #fb923c; }
.cosmic-spark-3 { animation-delay: 0.4s; left: 1px; background: #fbbf24; }

/* ---- Combo breathe ---- */
@keyframes cosmic-breathe {
    0%, 100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
}

.cosmic-combo-bg {
    background-size: 200% 200%;
    animation: cosmic-breathe 3s ease-in-out infinite;
}

/* Combo float */
@keyframes cosmic-float {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-4px); }
}

.cosmic-float {
    animation: cosmic-float 2s ease-in-out infinite;
}

/* Sparkle dots */
@keyframes cosmic-sparkle {
    0%, 100% { opacity: 0; transform: scale(0.5); }
    50%      { opacity: 1; transform: scale(1); }
}

.cosmic-sparkle {
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(255,255,255,0.7);
    pointer-events: none;
}

/* Lightning flash */
@keyframes cosmic-lightning-flash {
    0%, 40%  { opacity: 0; }
    50%      { opacity: 0.9; }
    60%, 100% { opacity: 0; }
}

.cosmic-lightning {
    opacity: 0;
    animation: cosmic-lightning-flash 1.5s ease-in-out infinite;
    pointer-events: none;
}

/* Scan line */
@keyframes cosmic-scan {
    0%   { top: 0%; }
    100% { top: 100%; }
}

.cosmic-scan-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(255,255,255,0.12);
    animation: cosmic-scan 3s linear infinite;
    pointer-events: none;
}

/* Corner glow dots */
@keyframes cosmic-corner-pulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50%      { opacity: 1;   transform: scale(1.4); }
}

.cosmic-corner-dot {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    animation: cosmic-corner-pulse 2s ease-in-out infinite;
    pointer-events: none;
}

/* ---- Trophy wobble ---- */
@keyframes cosmic-wobble {
    0%   { transform: rotate(0deg); }
    15%  { transform: rotate(5deg); }
    30%  { transform: rotate(-5deg); }
    45%  { transform: rotate(5deg); }
    60%  { transform: rotate(-5deg); }
    75%  { transform: rotate(3deg); }
    90%  { transform: rotate(-2deg); }
    100% { transform: rotate(0deg); }
}

.cosmic-wobble {
    display: inline-block;
    animation: cosmic-wobble 1.5s ease-in-out 1;
}

/* Achievement pulse dot */
@keyframes cosmic-pulse-dot {
    0%, 100% { transform: scale(1); opacity: 1; }
    50%      { transform: scale(1.5); opacity: 0.7; }
}

.cosmic-pulse-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--emerald);
    animation: cosmic-pulse-dot 1s ease-in-out infinite;
    box-shadow: 0 0 8px rgba(16,185,129,0.6);
}

/* Achievement confetti bg */
.cosmic-confetti-bg {
    background-image: radial-gradient(circle, rgba(16,185,129,0.08) 1px, transparent 1px),
                       radial-gradient(circle, rgba(99,102,241,0.06) 1px, transparent 1px);
    background-size: 20px 20px, 30px 30px;
    background-position: 0 0, 15px 15px;
}

/* Achievement complete flash */
@keyframes cosmic-complete-burst {
    0%   { opacity: 0; }
    40%  { opacity: 0.4; }
    100% { opacity: 0; }
}

.cosmic-complete-flash {
    position: absolute;
    inset: 0;
    border-radius: 24px;
    background: radial-gradient(circle at center, rgba(255,255,255,0.6) 0%, transparent 70%);
    animation: cosmic-complete-burst 0.6s ease-out forwards;
    pointer-events: none;
}

@keyframes cosmic-complete-text {
    0%   { opacity: 0; transform: translateY(10px); }
    30%  { opacity: 1; transform: translateY(0); }
    80%  { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-5px); }
}

.cosmic-complete-text {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: cosmic-complete-text 1.2s ease-out forwards;
    pointer-events: none;
    z-index: 5;
}

/* Golden shimmer text */
@keyframes golden-shimmer {
    to { background-position: 200% center; }
}

.cosmic-golden-text {
    background: linear-gradient(90deg, #f59e0b, #fff, #f59e0b);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: golden-shimmer 2s linear infinite;
}

/* ---- Pro button border spin ---- */
@keyframes cosmic-border-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}

.cosmic-pro-btn {
    position: relative;
    overflow: hidden;
    background: var(--bg-card);
    transition: background 0.3s ease;
}

.cosmic-pro-btn::before {
    content: '';
    position: absolute;
    top: -50%; left: -50%;
    width: 200%; height: 200%;
    background: conic-gradient(from 0deg, #f59e0b, #d97706, #f59e0b, #d97706, #f59e0b);
    animation: cosmic-border-spin 3s linear infinite;
    z-index: 0;
}

.cosmic-pro-btn::after {
    content: '';
    position: absolute;
    inset: 2px;
    border-radius: 9999px;
    background: var(--bg-card);
    z-index: 1;
    transition: background 0.3s ease;
}

.cosmic-pro-btn:hover::after {
    background: linear-gradient(135deg, #f59e0b, #d97706);
}

.cosmic-pro-btn span {
    position: relative;
    z-index: 2;
}

.cosmic-pro-btn .cosmic-btn-sparkle {
    display: inline-block;
    transition: transform 0.3s ease;
}

.cosmic-pro-btn:hover .cosmic-btn-sparkle {
    animation: cosmic-spin 0.8s linear infinite;
}

.cosmic-pro-btn:hover .cosmic-btn-text {
    background: linear-gradient(90deg, #fff, #fff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* ---- Star twinkle ---- */
@keyframes cosmic-twinkle {
    0%, 100% { opacity: var(--star-o, 0.3); transform: scale(1); }
    50%      { opacity: 1; transform: scale(1.5); }
}

.cosmic-star {
    position: absolute;
    border-radius: 50%;
    background: #fff;
    pointer-events: none;
    animation: cosmic-twinkle var(--star-dur) ease-in-out infinite;
    animation-delay: var(--star-delay);
}

/* ---- Cursor glow ---- */
.cosmic-cursor-glow {
    position: absolute;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%);
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: left 0.08s ease-out, top 0.08s ease-out;
    z-index: 0;
}

/* ---- XP Lightning hover ---- */
.xp-lightning-wrap {
    position: relative;
    padding: 4px 0;
    cursor: crosshair;
}

.electric-arcs-container {
    position: absolute;
    left: 0;
    right: 0;
    top: -14px;
    height: 16px;
    pointer-events: none;
    overflow: visible;
}

@keyframes arc-flicker {
    0%   { opacity: 0; }
    10%  { opacity: 1; }
    20%  { opacity: 0.3; }
    30%  { opacity: 0.9; }
    45%  { opacity: 0; }
    55%  { opacity: 0.8; }
    70%  { opacity: 0.2; }
    80%  { opacity: 1; }
    90%  { opacity: 0.4; }
    100% { opacity: 0; }
}

.electric-arc {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    animation: arc-flicker 0.25s steps(1) infinite;
}

.electric-arc-1 { animation-duration: 0.18s; top: 2px; }
.electric-arc-2 { animation-duration: 0.30s; top: -2px; opacity: 0.7; }

@keyframes xp-charge-shake {
    0%, 100% { transform: scaleY(1) translateX(0); }
    25%      { transform: scaleY(1.15) translateX(-0.5px); }
    50%      { transform: scaleY(0.95) translateX(0.5px); }
    75%      { transform: scaleY(1.1) translateX(0); }
}

@keyframes xp-charge-glow {
    0%, 100% { box-shadow: 0 0 0 1px var(--border); }
    50%      { box-shadow: 0 0 0 1px #06b6d4, 0 0 12px rgba(6,182,212,0.5), 0 0 24px rgba(99,102,241,0.3); }
}

.xp-track-charged {
    animation: xp-charge-shake 0.15s ease-in-out infinite,
               xp-charge-glow 0.4s ease-in-out infinite !important;
}

@keyframes xp-supercharge {
    0%   { background-position: 0% 50%; filter: brightness(1); }
    50%  { background-position: 100% 50%; filter: brightness(1.6); }
    100% { background-position: 0% 50%; filter: brightness(1); }
}

.xp-fill-charged {
    background: linear-gradient(90deg, #6366f1, #06b6d4, #ffffff, #a855f7, #06b6d4) !important;
    background-size: 300% 100% !important;
    animation: xp-supercharge 0.3s linear infinite !important;
}

@keyframes label-flash {
    0%, 100% { color: var(--text-muted); }
    50%      { color: #06b6d4; text-shadow: 0 0 8px rgba(6,182,212,0.6); }
}

.xp-label-charged {
    animation: label-flash 0.4s ease-in-out infinite;
}

.xp-percent-charged {
    animation: label-flash 0.3s ease-in-out infinite;
    color: #06b6d4 !important;
}
`;

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export default function PracticeSidebar() {
    const [profile, setProfile] = useState<UserProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const data = await fetchUserProfile();
                if (!cancelled) setProfile(data);
            } catch (err) {
                if (!cancelled) {
                    console.error('Failed to load user profile:', err);
                    setError('Không thể tải thông tin người dùng');
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, []);

    // Loading skeleton
    if (isLoading) {
        return (
            <>
                <style>{COSMIC_STYLES}</style>
                <aside className="cosmic-sidebar space-y-5">
                    <div className="rounded-[32px] p-6" style={{ background: 'var(--bg-card)', boxShadow: '0 0 0 1px var(--border)' }}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="cosmic-skeleton h-[72px] w-[72px] rounded-full" />
                            <div className="flex-1 space-y-2">
                                <div className="cosmic-skeleton h-4 w-24" />
                                <div className="cosmic-skeleton h-3 w-16" />
                            </div>
                        </div>
                        <div className="cosmic-skeleton h-2.5 rounded-full" />
                    </div>
                    <div className="flex gap-3">
                        <div className="cosmic-skeleton flex-1 h-16 rounded-2xl" />
                        <div className="cosmic-skeleton flex-1 h-16 rounded-2xl" />
                    </div>
                    <div className="cosmic-skeleton h-36 rounded-[24px]" />
                </aside>
            </>
        );
    }

    // Error state
    if (error || !profile) {
        return (
            <>
                <style>{COSMIC_STYLES}</style>
                <aside className="cosmic-sidebar rounded-[32px] p-6" style={{ background: 'var(--bg-card)', boxShadow: '0 0 0 1px var(--border), 0 0 20px var(--accent-glow)' }}>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {error || 'Không có dữ liệu'}
                    </p>
                </aside>
            </>
        );
    }

    return (
        <>
            <style>{COSMIC_STYLES}</style>
            <SidebarContent profile={profile} />
        </>
    );
}

/* ================================================================
   SIDEBAR CONTENT — all the visual magic
   ================================================================ */

function SidebarContent({ profile }: { profile: UserProfileData }) {
    const animatedXp = useCountUp(profile.xp_total);
    const animatedCombo = useCountUpDecimal(profile.combo_multiplier);
    const [xpHovered, setXpHovered] = useState(false);
    const combo = comboColor(profile.combo_multiplier);
    const achPercent = profile.current_achievement_total && profile.current_achievement_total > 0
        ? ((profile.current_achievement_progress ?? 0) / profile.current_achievement_total) * 100
        : 0;
    const isAchComplete = achPercent >= 100;

    // Star field
    const stars = useMemo(() => makeStars(20), []);

    // Cursor glow
    const sidebarRef = useRef<HTMLElement>(null);
    const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
    const handleSidebarMouse = useCallback((e: React.MouseEvent<HTMLElement>) => {
        const el = sidebarRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        setCursor({ x: e.clientX - r.left, y: e.clientY - r.top });
    }, []);
    const handleSidebarLeave = useCallback(() => setCursor(null), []);

    // 3D tilt refs for each card
    const tiltProfile = useTilt();
    const tiltStreak = useTilt();
    const tiltXp = useTilt();
    const tiltCombo = useTilt();
    const tiltAch = useTilt();
    const tiltPro = useTilt();

    return (
        <aside
            ref={sidebarRef}
            className="cosmic-sidebar space-y-5 relative"
            onMouseMove={handleSidebarMouse}
            onMouseLeave={handleSidebarLeave}
        >
            {/* Star field */}
            {stars.map(s => (
                <div
                    key={s.id}
                    className="cosmic-star"
                    style={{
                        left: `${s.x}%`,
                        top: `${s.y}%`,
                        width: s.size,
                        height: s.size,
                        '--star-o': s.opacity,
                        '--star-dur': `${s.dur}s`,
                        '--star-delay': `${s.delay}s`,
                    } as React.CSSProperties}
                />
            ))}

            {/* Cursor glow */}
            {cursor && (
                <div
                    className="cosmic-cursor-glow"
                    style={{ left: cursor.x, top: cursor.y }}
                />
            )}

            {/* ====== Profile Card ====== */}
            <div
                ref={tiltProfile.ref}
                onMouseMove={tiltProfile.onMove}
                onMouseLeave={tiltProfile.onLeave}
                className="cosmic-card rounded-[32px] p-6 relative z-[1]"
                style={{
                    background: 'var(--bg-card)',
                    boxShadow: '0 0 0 1px var(--border), 0 0 20px var(--accent-glow)',
                    animationDelay: '0s',
                    ...tiltProfile.style,
                }}
            >
                <div className="flex items-center gap-3 mb-4">
                    {/* Multi-layer avatar aura */}
                    <div className="avatar-wrapper">
                        <div className="aura-outer" />
                        <div className="aura-ring" />
                        <div className="aura-inner">
                            {profile.avatar_url ? (
                                <img
                                    src={profile.avatar_url}
                                    alt={profile.display_name || 'Avatar'}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : (
                                <div
                                    className="h-full w-full rounded-full flex items-center justify-center text-xl font-bold font-outfit"
                                    style={{
                                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                        color: '#fff',
                                    }}
                                >
                                    {(profile.display_name || '?').charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate" style={{ color: 'var(--text-primary)', fontFamily: "'Outfit', sans-serif" }}>
                            {profile.display_name || 'Học sinh'}
                        </p>
                        {profile.title && (
                            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                                {profile.title}
                            </p>
                        )}
                    </div>

                    {/* Level badge */}
                    <span
                        className="cosmic-level-badge flex-shrink-0 rounded-full px-3 py-1 text-xs font-bold font-outfit"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff' }}
                    >
                        Lv.{profile.level}
                    </span>
                </div>

                {/* XP Progress */}
                <div
                    className="xp-lightning-wrap"
                    onMouseEnter={() => setXpHovered(true)}
                    onMouseLeave={() => setXpHovered(false)}
                >
                    {xpHovered && (
                        <div className="electric-arcs-container">
                            <ElectricArc index={0} />
                            <ElectricArc index={1} />
                            <ElectricArc index={2} />
                        </div>
                    )}
                    <div className={`mb-1.5 flex items-center justify-between text-[11px] font-outfit ${xpHovered ? 'xp-label-charged' : ''}`} style={{ color: 'var(--text-muted)' }}>
                        <span className="uppercase tracking-wider font-semibold">XP Progress</span>
                        <span className={xpHovered ? 'xp-percent-charged' : ''} style={{ color: xpHovered ? undefined : 'var(--accent)' }}>{profile.xp_progress_percent}%</span>
                    </div>
                    <div className={`h-2.5 rounded-full cosmic-xp-track relative ${xpHovered ? 'xp-track-charged' : ''}`} style={{ background: 'var(--bg-card-2)', border: '1px solid var(--border)' }}>
                        <div
                            className={`cosmic-xp-fill h-full rounded-full transition-all duration-700 ${xpHovered ? 'xp-fill-charged' : ''}`}
                            style={{ width: `${Math.min(profile.xp_progress_percent, 100)}%` }}
                        />
                        {/* Particle burst at fill edge */}
                        <div style={{ position: 'absolute', right: `${100 - Math.min(profile.xp_progress_percent, 100)}%`, top: '50%' }}>
                            <XpParticleBurst />
                        </div>
                    </div>
                    <p className="mt-1.5 text-[10px] font-outfit" style={{ color: 'var(--text-muted)' }}>
                        {profile.xp_total.toLocaleString()} / {profile.xp_to_next_level.toLocaleString()} XP
                    </p>
                </div>

                {profile.is_pro && (
                    <span
                        className="mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold font-outfit"
                        style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--gold)' }}
                    >
                        ⭐ PRO
                    </span>
                )}
            </div>

            {/* ====== Streak + XP Counters ====== */}
            <div className="flex gap-3 relative z-[1]">
                <div
                    ref={tiltStreak.ref}
                    onMouseMove={tiltStreak.onMove}
                    onMouseLeave={tiltStreak.onLeave}
                    className="cosmic-card cosmic-glass flex-1 rounded-2xl px-4 py-3"
                    style={{
                        border: '1px solid var(--border)',
                        animationDelay: '0.08s',
                        ...tiltStreak.style,
                    }}
                >
                    <p className="text-lg font-bold font-outfit" style={{ color: 'var(--text-primary)' }}>
                        <span className="cosmic-fire-wrap">
                            <span className="cosmic-fire-emoji">🔥</span>
                            <span className="cosmic-spark" />
                            <span className="cosmic-spark cosmic-spark-2" />
                            <span className="cosmic-spark cosmic-spark-3" />
                        </span>{' '}
                        {profile.streak_days} Ngày
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Chuỗi ngày</p>
                </div>
                <div
                    ref={tiltXp.ref}
                    onMouseMove={tiltXp.onMove}
                    onMouseLeave={tiltXp.onLeave}
                    className="cosmic-card cosmic-glass flex-1 rounded-2xl px-4 py-3"
                    style={{
                        border: '1px solid var(--border)',
                        animationDelay: '0.16s',
                        ...tiltXp.style,
                    }}
                >
                    <p className="text-lg font-bold font-outfit" style={{ color: 'var(--text-primary)' }}>
                        📊 {animatedXp.toLocaleString()} XP
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Tổng điểm</p>
                </div>
            </div>

            {/* ====== Combo Multiplier ====== */}
            {profile.combo_multiplier > 1 && (
                <div
                    ref={tiltCombo.ref}
                    onMouseMove={tiltCombo.onMove}
                    onMouseLeave={tiltCombo.onLeave}
                    className="cosmic-card cosmic-combo-bg rounded-[24px] p-5 relative overflow-hidden z-[1]"
                    style={{
                        background: combo.bg,
                        backgroundSize: '200% 200%',
                        boxShadow: `0 0 30px ${combo.shadow}`,
                        animationDelay: '0.24s',
                        ...tiltCombo.style,
                    }}
                >
                    {/* Scan line */}
                    <div className="cosmic-scan-line" />

                    {/* Corner glow dots */}
                    <div className="cosmic-corner-dot" style={{ top: 8, left: 8, background: combo.glow, boxShadow: `0 0 6px ${combo.glow}`, animationDelay: '0s' }} />
                    <div className="cosmic-corner-dot" style={{ top: 8, right: 8, background: combo.glow, boxShadow: `0 0 6px ${combo.glow}`, animationDelay: '0.5s' }} />
                    <div className="cosmic-corner-dot" style={{ bottom: 8, left: 8, background: combo.glow, boxShadow: `0 0 6px ${combo.glow}`, animationDelay: '1s' }} />
                    <div className="cosmic-corner-dot" style={{ bottom: 8, right: 8, background: combo.glow, boxShadow: `0 0 6px ${combo.glow}`, animationDelay: '1.5s' }} />

                    {/* Sparkle particles */}
                    <div className="cosmic-sparkle" style={{ top: '12%', right: '15%', animation: 'cosmic-sparkle 2s ease infinite 0s' }} />
                    <div className="cosmic-sparkle" style={{ top: '60%', right: '8%', animation: 'cosmic-sparkle 2s ease infinite 0.5s', width: '3px', height: '3px' }} />
                    <div className="cosmic-sparkle" style={{ top: '30%', right: '35%', animation: 'cosmic-sparkle 2s ease infinite 1s' }} />
                    <div className="cosmic-sparkle" style={{ bottom: '15%', left: '20%', animation: 'cosmic-sparkle 2s ease infinite 1.5s', width: '5px', height: '5px' }} />

                    {/* Lightning bolts */}
                    <LightningBolt side="left" delay={0} />
                    <LightningBolt side="right" delay={0.75} />

                    <p className="text-xs font-bold uppercase tracking-wider font-outfit relative z-[1]" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        ⚡ Hệ số Combo
                    </p>
                    <p
                        className="cosmic-float mt-1 font-outfit relative z-[1]"
                        style={{
                            fontSize: '3.5rem',
                            fontWeight: 900,
                            lineHeight: 1,
                            color: '#fff',
                            textShadow: `0 0 20px ${combo.shadow}, 0 0 40px ${combo.shadow}`,
                        }}
                    >
                        x{animatedCombo.toFixed(1)}
                    </p>
                    <p className="text-xs font-medium font-outfit relative z-[1]" style={{ color: 'rgba(255,255,255,0.9)' }}>
                        XP Multiplier
                    </p>
                    <p className="mt-1 text-xs relative z-[1]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                        {profile.combo_label}
                    </p>
                </div>
            )}

            {/* ====== Achievement ====== */}
            {profile.current_achievement_name && (
                <div
                    ref={tiltAch.ref}
                    onMouseMove={tiltAch.onMove}
                    onMouseLeave={tiltAch.onLeave}
                    className="cosmic-card cosmic-confetti-bg rounded-[24px] p-5 relative overflow-hidden z-[1]"
                    style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        animationDelay: '0.32s',
                        ...tiltAch.style,
                    }}
                >
                    {/* Complete flash overlay */}
                    {isAchComplete && (
                        <>
                            <div className="cosmic-complete-flash" />
                            <div className="cosmic-complete-text">
                                <span className="text-lg font-bold font-outfit" style={{ color: '#fff', textShadow: '0 0 20px rgba(245,158,11,0.8)' }}>
                                    COMPLETE! 🎉
                                </span>
                            </div>
                        </>
                    )}

                    <p className={`text-xs font-bold uppercase tracking-wider font-outfit ${isAchComplete ? 'cosmic-golden-text' : ''}`}
                       style={isAchComplete ? {} : { color: 'var(--text-muted)' }}>
                        <span className="cosmic-wobble">🏆</span> {profile.current_achievement_name}
                    </p>
                    {profile.current_achievement_desc && (
                        <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                            {profile.current_achievement_desc}
                        </p>
                    )}
                    {profile.current_achievement_total != null && profile.current_achievement_total > 0 && (
                        <>
                            <div className="mt-3 relative">
                                <div className="h-2.5 rounded-full" style={{ background: 'var(--bg-card-2)', border: '1px solid var(--border)' }}>
                                    <div
                                        className="h-full rounded-full transition-all duration-700"
                                        style={{
                                            width: `${Math.min(achPercent, 100)}%`,
                                            background: 'linear-gradient(90deg, #10b981, #34d399)',
                                            boxShadow: '0 0 8px rgba(16,185,129,0.4)',
                                        }}
                                    />
                                </div>
                                {achPercent > 0 && achPercent < 100 && (
                                    <div
                                        className="cosmic-pulse-dot absolute top-1/2"
                                        style={{ left: `${achPercent}%`, transform: 'translate(-50%, -50%)' }}
                                    />
                                )}
                            </div>
                            <p className="mt-2 text-xs font-outfit" style={{ color: 'var(--text-muted)' }}>
                                {profile.current_achievement_progress ?? 0}/{profile.current_achievement_total} bài
                            </p>
                        </>
                    )}
                </div>
            )}

            {/* ====== Pro Upgrade CTA ====== */}
            {!profile.is_pro && (
                <div
                    ref={tiltPro.ref}
                    onMouseMove={tiltPro.onMove}
                    onMouseLeave={tiltPro.onLeave}
                    className="relative z-[1]"
                    style={tiltPro.style}
                >
                    <button
                        className="cosmic-card cosmic-pro-btn w-full rounded-full px-5 py-3.5 text-sm font-semibold cursor-pointer"
                        style={{ animationDelay: '0.4s' }}
                    >
                        <span className="relative z-[2] flex items-center justify-center gap-2">
                            <span className="cosmic-btn-sparkle">✨</span>
                            <span
                                className="cosmic-btn-text font-outfit font-bold"
                                style={{
                                    background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Nâng cấp Pro
                            </span>
                        </span>
                    </button>
                </div>
            )}
        </aside>
    );
}
