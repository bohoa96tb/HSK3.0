// Review narration: editorial arrangement of existing lesson text.
// Device TTS only; never presented as publisher recordings or verified audio.
// A lesson is enabled only after its own content QA (user-approved sample:
// HSK 2 Lesson 1, PR #112–#115; rollout one lesson per round, D31).
export const REVIEW_LESSONS = ['hsk2-l01', 'hsk2-l02', 'hsk2-l03', 'hsk2-l04',
 'hsk1-l01', 'hsk1-l02', 'hsk1-l03', 'hsk1-l04', 'hsk1-l05', 'hsk1-l06', 'hsk1-l07', 'hsk1-l08',
 'hsk1-l09', 'hsk1-l10', 'hsk1-l11', 'hsk1-l12', 'hsk1-l13', 'hsk1-l14', 'hsk1-l15'];
export const REVIEW_LESSON = REVIEW_LESSONS[0];
// D34 (Hoa, 2026-11-08): the vocabulary tracks read every word TWICE
// (male, then female), but the word audio refs in the lesson data only
// span the first reading, so the review cut words off after the male
// voice. These review-only spans cover BOTH readings: derived from RMS
// speech-region analysis of the actual tracks (each word's regions in
// book order), cross-checked by transcribing every region separately;
// a span runs from just before the word's first reading to just before
// the next word's first reading. Lesson data itself is unchanged, and
// sentence segments (read once) keep using the data refs as before.
// Analysis artifacts: ~/workspace/hsk3-work/review-word-segments-analysis.py
// and review-word-segments.json in the working area.
export const REVIEW_WORD_SEGMENTS = {
 'h2l1-w01': {start: 0.49, end: 2.75},
 'h2l1-w02': {start: 2.77, end: 5.0},
 'h2l1-w03': {start: 5.02, end: 7.18},
 'h2l1-w04': {start: 7.2, end: 8.96},
 'h2l1-w05': {start: 0.61, end: 2.77},
 'h2l1-w06': {start: 2.79, end: 5.05},
 'h2l1-w07': {start: 0.42, end: 3.64},
 'h2l1-w08': {start: 3.66, end: 7.1},
 'h2l1-w09': {start: 7.12, end: 9.89},
 'h2l1-w10': {start: 9.91, end: 11.57},
 'h2l1-w11': {start: 0.36, end: 2.96},
 'h2l1-w12': {start: 2.98, end: 5.77},
 'h2l1-w13': {start: 5.79, end: 8.1},
 'h2l1-w14': {start: 8.12, end: 10.68},
 'h2l1-w15': {start: 10.7, end: 14.1},
 'h2l2-w01': {start: 0.61, end: 3.81},
 'h2l2-w02': {start: 3.83, end: 5.77},
 'h2l2-w03': {start: 5.79, end: 8.37},
 'h2l2-w04': {start: 8.39, end: 10.72},
 'h2l2-w05': {start: 10.74, end: 13.77},
 'h2l2-w06': {start: 13.79, end: 16.45},
 'h2l2-w07': {start: 16.47, end: 19.76},
 'h2l2-w08': {start: 0.35, end: 2.96},
 'h2l2-w09': {start: 2.98, end: 5.25},
 'h2l2-w10': {start: 5.27, end: 7.62},
 'h2l2-w11': {start: 7.64, end: 10.3},
 'h2l2-w12': {start: 10.32, end: 13.15},
 'h2l2-w13': {start: 13.17, end: 15.26},
 'h2l2-w14': {start: 15.28, end: 17.43},
 'h2l2-w15': {start: 0.89, end: 4.34},
 'h2l2-w16': {start: 4.36, end: 6.19},
 'h2l2-w17': {start: 0.77, end: 3.22},
 'h2l3-w01': {start: 0.79, end: 3.87},
 'h2l3-w02': {start: 3.89, end: 6.41},
 'h2l3-w03': {start: 6.43, end: 8.04},
 'h2l3-w04': {start: 0.58, end: 3.89},
 'h2l3-w05': {start: 3.91, end: 6.51},
 'h2l3-w06': {start: 0.76, end: 3.29},
 'h2l3-w07': {start: 3.31, end: 6.06},
 'h2l3-w08': {start: 6.08, end: 8.16},
 'h2l3-w09': {start: 8.18, end: 10.49},
 'h2l3-w10': {start: 10.51, end: 13.43},
 'h2l3-w11': {start: 13.45, end: 15.66},
 'h2l3-w12': {start: 0.48, end: 2.88},
 'h2l3-w13': {start: 2.9, end: 5.53},
 'h2l3-w14': {start: 5.55, end: 7.85},
 'h2l3-w15': {start: 7.87, end: 9.55},
 // hsk2-l04 (2026-11-13): same D34 method — RMS speech regions of the four
 // vocabulary tracks (4-2/4-4/4-6/4-8), each region cross-checked by
 // transcribing it separately; merged ASR units on 4-2 and 4-6 resolved
 // this way. Spans cover both readings, asr-draft like all segments.
 'h2l4-w01': {start: 0.06, end: 2.59},
 'h2l4-w02': {start: 2.6, end: 5.79},
 'h2l4-w03': {start: 5.8, end: 8.44},
 'h2l4-w04': {start: 8.45, end: 10.64},
 'h2l4-w05': {start: 10.65, end: 12.9},
 'h2l4-w06': {start: 0.14, end: 3.59},
 'h2l4-w07': {start: 3.6, end: 6.49},
 'h2l4-w08': {start: 6.5, end: 8.69},
 'h2l4-w09': {start: 8.7, end: 11.39},
 'h2l4-w10': {start: 11.4, end: 14.35},
 'h2l4-w11': {start: 0.63, end: 3.54},
 'h2l4-w12': {start: 3.55, end: 6.29},
 'h2l4-w13': {start: 6.3, end: 9.19},
 'h2l4-w14': {start: 9.2, end: 12.24},
 'h2l4-w15': {start: 12.25, end: 14.25},
 'h2l4-w16': {start: 0.27, end: 3.1},
 // D35 (Hoa, 2026-11-08): HSK 1 rollout — same double-reading span
 // method as D34, derived per track from RMS speech regions plus
 // per-region crop-ASR verification; entries carry their trackId so
 // words whose lesson data has no audio ref (proper nouns and a few
 // list words the tracks do read) still play the book segment.
 // hsk1-l01
 'tbw-1': {trackId: 'trk-tb-l01-2', start: 0.19, end: 3.46},
 'tbw-13': {trackId: 'trk-tb-l01-2', start: 3.48, end: 6.41},
 'tbw-2': {trackId: 'trk-tb-l01-4', start: 0.08, end: 2.72},
 'tbw-3': {trackId: 'trk-tb-l01-4', start: 2.74, end: 5.02},
 'tbw-4': {trackId: 'trk-tb-l01-4', start: 5.04, end: 8.2},
 'tbw-5': {trackId: 'trk-tb-l01-4', start: 8.22, end: 10.72},
 'tbw-6': {trackId: 'trk-tb-l01-4', start: 10.74, end: 13.56},
 'tbw-7': {trackId: 'trk-tb-l01-4', start: 13.58, end: 16.24},
 'tbw-8': {trackId: 'trk-tb-l01-4', start: 16.26, end: 18.14},
 'tbw-9': {trackId: 'trk-tb-l01-6', start: 0.2, end: 3.12},
 'tbw-10': {trackId: 'trk-tb-l01-6', start: 3.14, end: 6.23},
 'tbw-11': {trackId: 'trk-tb-l01-6', start: 6.25, end: 9.18},
 'tbw-12': {trackId: 'trk-tb-l01-6', start: 9.2, end: 11.52},
 // hsk1-l02
 'l02w-1': {trackId: 'trk-tb-l02-2', start: 0.2, end: 3.31},
 'l02w-2': {trackId: 'trk-tb-l02-2', start: 3.33, end: 5.76},
 'l02w-3': {trackId: 'trk-tb-l02-2', start: 5.78, end: 8.05},
 'l02w-4': {trackId: 'trk-tb-l02-2', start: 8.07, end: 10.53},
 'l02w-5': {trackId: 'trk-tb-l02-2', start: 10.55, end: 13.04},
 'l02w-6': {trackId: 'trk-tb-l02-2', start: 13.06, end: 15.02},
 'l02w-7': {trackId: 'trk-tb-l02-4', start: 0.34, end: 2.54},
 'l02w-8': {trackId: 'trk-tb-l02-4', start: 2.56, end: 4.99},
 'l02w-9': {trackId: 'trk-tb-l02-4', start: 5.01, end: 7.9},
 'l02w-10': {trackId: 'trk-tb-l02-4', start: 7.92, end: 10.84},
 'l02w-11': {trackId: 'trk-tb-l02-4', start: 10.86, end: 13.0},
 'l02w-12': {trackId: 'trk-tb-l02-6', start: 0.42, end: 3.0},
 'l02w-13': {trackId: 'trk-tb-l02-6', start: 3.02, end: 5.73},
 'l02w-14': {trackId: 'trk-tb-l02-6', start: 5.75, end: 8.18},
 'l02w-15': {trackId: 'trk-tb-l02-6', start: 8.2, end: 10.08},
 // hsk1-l03
 'l03w-1': {trackId: 'trk-tb-l03-2', start: 0.25, end: 2.71},
 'l03w-2': {trackId: 'trk-tb-l03-2', start: 2.73, end: 5.14},
 'l03w-p1': {trackId: 'trk-tb-l03-2', start: 5.16, end: 8.08},
 'l03w-p2': {trackId: 'trk-tb-l03-2', start: 8.1, end: 10.86},
 'l03w-p3': {trackId: 'trk-tb-l03-2', start: 10.88, end: 13.4},
 'l03w-3': {trackId: 'trk-tb-l03-4', start: 0.2, end: 2.63},
 'l03w-4': {trackId: 'trk-tb-l03-4', start: 2.65, end: 8.15},
 'l03w-5': {trackId: 'trk-tb-l03-4', start: 8.17, end: 11.3},
 'l03w-6': {trackId: 'trk-tb-l03-4', start: 11.32, end: 13.71},
 'l03w-7': {trackId: 'trk-tb-l03-4', start: 13.73, end: 15.93},
 'l03w-8': {trackId: 'trk-tb-l03-4', start: 15.95, end: 18.11},
 'l03w-p4': {trackId: 'trk-tb-l03-4', start: 18.13, end: 20.53},
 'l03w-9': {trackId: 'trk-tb-l03-6', start: 0.58, end: 3.57},
 'l03w-10': {trackId: 'trk-tb-l03-6', start: 3.59, end: 6.86},
 'l03w-11': {trackId: 'trk-tb-l03-6', start: 6.88, end: 10.24},
 'l03w-12': {trackId: 'trk-tb-l03-6', start: 10.26, end: 12.53},
 'l03w-13': {trackId: 'trk-tb-l03-6', start: 12.55, end: 14.98},
 'l03w-14': {trackId: 'trk-tb-l03-6', start: 15.0, end: 17.04},
 'l03w-15': {trackId: 'trk-tb-l03-6', start: 17.06, end: 19.23},
 'l03w-16': {trackId: 'trk-tb-l03-6', start: 19.25, end: 21.35},
 'l03w-17': {trackId: 'trk-tb-l03-6', start: 21.37, end: 23.69},
 'l03w-18': {trackId: 'trk-tb-l03-6', start: 23.71, end: 25.7},
 // hsk1-l04
 'l04w-1': {trackId: 'trk-tb-l04-2', start: 0.45, end: 3.12},
 'l04w-2': {trackId: 'trk-tb-l04-2', start: 3.14, end: 6.02},
 'l04w-3': {trackId: 'trk-tb-l04-2', start: 6.04, end: 7.71},
 'l04w-4': {trackId: 'trk-tb-l04-4', start: 0.27, end: 3.26},
 'l04w-5': {trackId: 'trk-tb-l04-4', start: 3.28, end: 5.82},
 'l04w-6': {trackId: 'trk-tb-l04-4', start: 5.84, end: 8.81},
 'l04w-7': {trackId: 'trk-tb-l04-4', start: 8.83, end: 11.17},
 'l04w-8': {trackId: 'trk-tb-l04-4', start: 11.19, end: 13.65},
 'l04w-9': {trackId: 'trk-tb-l04-4', start: 13.67, end: 16.17},
 'l04w-10': {trackId: 'trk-tb-l04-4', start: 16.19, end: 18.88},
 'l04w-11': {trackId: 'trk-tb-l04-4', start: 18.9, end: 21.53},
 'l04w-12': {trackId: 'trk-tb-l04-4', start: 21.55, end: 24.38},
 'l04w-13': {trackId: 'trk-tb-l04-4', start: 24.4, end: 26.36},
 'l04w-14': {trackId: 'trk-tb-l04-6', start: 0.15, end: 3.09},
 'l04w-15': {trackId: 'trk-tb-l04-6', start: 3.11, end: 6.06},
 'l04w-16': {trackId: 'trk-tb-l04-6', start: 6.08, end: 9.11},
 'l04w-17': {trackId: 'trk-tb-l04-6', start: 9.13, end: 11.59},
 'l04w-18': {trackId: 'trk-tb-l04-6', start: 11.61, end: 13.86},
 'l04w-19': {trackId: 'trk-tb-l04-6', start: 13.88, end: 16.57},
 'l04w-20': {trackId: 'trk-tb-l04-6', start: 16.59, end: 18.79},
 'l04w-21': {trackId: 'trk-tb-l04-6', start: 18.81, end: 20.47},
 // hsk1-l05
 'l05w-1': {trackId: 'trk-tb-l05-2', start: 0.54, end: 3.27},
 'l05w-2': {trackId: 'trk-tb-l05-2', start: 3.29, end: 5.5},
 'l05w-3': {trackId: 'trk-tb-l05-2', start: 5.52, end: 7.89},
 'l05w-4': {trackId: 'trk-tb-l05-2', start: 7.91, end: 10.35},
 'l05w-5': {trackId: 'trk-tb-l05-2', start: 10.37, end: 13.17},
 'l05w-6': {trackId: 'trk-tb-l05-2', start: 13.19, end: 16.87},
 'l05w-7': {trackId: 'trk-tb-l05-2', start: 16.89, end: 20.77},
 'l05w-8': {trackId: 'trk-tb-l05-2', start: 20.79, end: 23.08},
 'l05w-9': {trackId: 'trk-tb-l05-4', start: 0.43, end: 2.84},
 'l05w-10': {trackId: 'trk-tb-l05-4', start: 2.86, end: 5.82},
 'l05w-11': {trackId: 'trk-tb-l05-4', start: 5.84, end: 8.28},
 'l05w-12': {trackId: 'trk-tb-l05-4', start: 8.3, end: 11.6},
 'l05w-13': {trackId: 'trk-tb-l05-4', start: 11.62, end: 13.58},
 'l05w-14': {trackId: 'trk-tb-l05-4', start: 13.6, end: 17.21},
 'l05w-15': {trackId: 'trk-tb-l05-4', start: 17.23, end: 19.09},
 'l05w-16': {trackId: 'trk-tb-l05-6', start: 0.2, end: 3.23},
 'l05w-17': {trackId: 'trk-tb-l05-6', start: 3.25, end: 5.46},
 'l05w-18': {trackId: 'trk-tb-l05-6', start: 5.48, end: 8.41},
 'l05w-19': {trackId: 'trk-tb-l05-6', start: 8.43, end: 10.63},
 'l05w-20': {trackId: 'trk-tb-l05-6', start: 10.65, end: 13.33},
 'l05w-21': {trackId: 'trk-tb-l05-6', start: 13.35, end: 16.28},
 'l05w-22': {trackId: 'trk-tb-l05-6', start: 16.3, end: 18.22},
 // hsk1-l06
 'l06w-1': {trackId: 'trk-tb-l06-2', start: 0.32, end: 3.09},
 'l06w-2': {trackId: 'trk-tb-l06-2', start: 3.11, end: 6.1},
 'l06w-3': {trackId: 'trk-tb-l06-2', start: 6.12, end: 7.81},
 'l06w-4': {trackId: 'trk-tb-l06-4', start: 0.15, end: 2.98},
 'l06w-5': {trackId: 'trk-tb-l06-4', start: 3.0, end: 5.2},
 'l06w-6': {trackId: 'trk-tb-l06-4', start: 5.22, end: 7.54},
 'l06w-7': {trackId: 'trk-tb-l06-4', start: 7.56, end: 10.28},
 'l06w-8': {trackId: 'trk-tb-l06-4', start: 10.3, end: 13.29},
 'l06w-9': {trackId: 'trk-tb-l06-4', start: 13.31, end: 15.91},
 'l06w-10': {trackId: 'trk-tb-l06-4', start: 15.93, end: 18.52},
 'l06w-11': {trackId: 'trk-tb-l06-4', start: 18.54, end: 20.9},
 'l06w-12': {trackId: 'trk-tb-l06-4', start: 20.92, end: 23.68},
 'l06w-13': {trackId: 'trk-tb-l06-6', start: 0.42, end: 2.93},
 'l06w-14': {trackId: 'trk-tb-l06-6', start: 2.95, end: 6.05},
 'l06w-15': {trackId: 'trk-tb-l06-6', start: 6.07, end: 9.02},
 'l06w-16': {trackId: 'trk-tb-l06-6', start: 9.04, end: 11.89},
 'l06w-17': {trackId: 'trk-tb-l06-6', start: 11.91, end: 14.79},
 'l06w-18': {trackId: 'trk-tb-l06-6', start: 14.81, end: 18.0},
 'l06w-19': {trackId: 'trk-tb-l06-6', start: 18.02, end: 21.08},
 'l06w-20': {trackId: 'trk-tb-l06-6', start: 21.1, end: 23.83},
 'l06w-21': {trackId: 'trk-tb-l06-6', start: 23.85, end: 26.09},
 'l06w-22': {trackId: 'trk-tb-l06-6', start: 26.11, end: 29.59},
 'l06w-p1': {trackId: 'trk-tb-l06-6', start: 29.61, end: 33.33},
 // hsk1-l07
 'l07w-1': {trackId: 'trk-tb-l07-2', start: 0.41, end: 3.38},
 'l07w-2': {trackId: 'trk-tb-l07-2', start: 3.4, end: 5.74},
 'l07w-3': {trackId: 'trk-tb-l07-2', start: 5.76, end: 8.37},
 'l07w-4': {trackId: 'trk-tb-l07-2', start: 8.39, end: 11.51},
 'l07w-5': {trackId: 'trk-tb-l07-2', start: 11.53, end: 13.41},
 'l07w-6': {trackId: 'trk-tb-l07-2', start: 13.43, end: 15.4},
 'l07w-7': {trackId: 'trk-tb-l07-2', start: 15.42, end: 18.4},
 'l07w-8': {trackId: 'trk-tb-l07-2', start: 18.42, end: 20.55},
 'l07w-9': {trackId: 'trk-tb-l07-2', start: 20.57, end: 21.73},
 'l07w-10': {trackId: 'trk-tb-l07-4', start: 0.37, end: 3.89},
 'l07w-11': {trackId: 'trk-tb-l07-4', start: 3.91, end: 6.2},
 'l07w-12': {trackId: 'trk-tb-l07-4', start: 6.22, end: 9.19},
 'l07w-13': {trackId: 'trk-tb-l07-4', start: 9.21, end: 11.57},
 'l07w-14': {trackId: 'trk-tb-l07-4', start: 11.59, end: 14.78},
 'l07w-15': {trackId: 'trk-tb-l07-4', start: 14.8, end: 16.96},
 'l07w-16': {trackId: 'trk-tb-l07-4', start: 16.98, end: 19.14},
 'l07w-17': {trackId: 'trk-tb-l07-4', start: 19.16, end: 21.69},
 'l07w-18': {trackId: 'trk-tb-l07-6', start: 0.49, end: 2.76},
 'l07w-19': {trackId: 'trk-tb-l07-6', start: 2.78, end: 5.39},
 'l07w-20': {trackId: 'trk-tb-l07-6', start: 5.41, end: 10.8},
 'l07w-21': {trackId: 'trk-tb-l07-6', start: 10.82, end: 13.79},
 'l07w-22': {trackId: 'trk-tb-l07-6', start: 13.81, end: 16.79},
 'l07w-23': {trackId: 'trk-tb-l07-6', start: 16.81, end: 20.06},
 'l07w-24': {trackId: 'trk-tb-l07-6', start: 20.08, end: 22.47},
 'l07w-25': {trackId: 'trk-tb-l07-6', start: 22.49, end: 24.76},
 'l07w-26': {trackId: 'trk-tb-l07-6', start: 24.78, end: 27.35},
 'l07w-27': {trackId: 'trk-tb-l07-6', start: 27.37, end: 29.05},
 // hsk1-l08
 'l08w-1': {trackId: 'trk-tb-l08-2', start: 0.56, end: 3.28},
 'l08w-2': {trackId: 'trk-tb-l08-2', start: 3.3, end: 5.6},
 'l08w-3': {trackId: 'trk-tb-l08-2', start: 5.62, end: 7.79},
 'l08w-4': {trackId: 'trk-tb-l08-2', start: 7.81, end: 10.31},
 'l08w-5': {trackId: 'trk-tb-l08-2', start: 10.33, end: 12.76},
 'l08w-6': {trackId: 'trk-tb-l08-2', start: 12.78, end: 15.08},
 'l08w-7': {trackId: 'trk-tb-l08-2', start: 15.1, end: 17.95},
 'l08w-8': {trackId: 'trk-tb-l08-2', start: 17.97, end: 20.82},
 'l08w-9': {trackId: 'trk-tb-l08-2', start: 20.84, end: 23.16},
 'l08w-10': {trackId: 'trk-tb-l08-2', start: 23.18, end: 25.5},
 'l08w-11': {trackId: 'trk-tb-l08-4', start: 0.66, end: 2.82},
 'l08w-12': {trackId: 'trk-tb-l08-4', start: 2.84, end: 5.61},
 'l08w-13': {trackId: 'trk-tb-l08-4', start: 5.63, end: 8.58},
 'l08w-14': {trackId: 'trk-tb-l08-4', start: 8.6, end: 11.0},
 'l08w-15': {trackId: 'trk-tb-l08-4', start: 11.02, end: 13.38},
 'l08w-16': {trackId: 'trk-tb-l08-4', start: 13.4, end: 15.57},
 'l08w-17': {trackId: 'trk-tb-l08-4', start: 15.59, end: 17.89},
 'l08w-18': {trackId: 'trk-tb-l08-6', start: 0.6, end: 2.8},
 'l08w-19': {trackId: 'trk-tb-l08-6', start: 2.82, end: 4.95},
 'l08w-20': {trackId: 'trk-tb-l08-6', start: 4.97, end: 7.77},
 'l08w-21': {trackId: 'trk-tb-l08-6', start: 7.79, end: 9.99},
 'l08w-22': {trackId: 'trk-tb-l08-6', start: 10.01, end: 12.66},
 'l08w-23': {trackId: 'trk-tb-l08-6', start: 12.68, end: 15.32},
 'l08w-24': {trackId: 'trk-tb-l08-6', start: 15.34, end: 18.16},
 // hsk1-l09
 'l09w-1': {trackId: 'trk-tb-l09-2', start: 0.51, end: 3.66},
 'l09w-2': {trackId: 'trk-tb-l09-2', start: 3.68, end: 8.72},
 'l09w-3': {trackId: 'trk-tb-l09-2', start: 8.74, end: 11.32},
 'l09w-4': {trackId: 'trk-tb-l09-2', start: 11.34, end: 14.05},
 'l09w-5': {trackId: 'trk-tb-l09-2', start: 14.07, end: 16.24},
 'l09w-6': {trackId: 'trk-tb-l09-4', start: 0.45, end: 3.29},
 'l09w-7': {trackId: 'trk-tb-l09-4', start: 3.31, end: 8.39},
 'l09w-8': {trackId: 'trk-tb-l09-4', start: 8.41, end: 10.61},
 'l09w-9': {trackId: 'trk-tb-l09-4', start: 10.63, end: 13.19},
 'l09w-10': {trackId: 'trk-tb-l09-4', start: 13.21, end: 15.68},
 'l09w-11': {trackId: 'trk-tb-l09-4', start: 15.7, end: 17.98},
 'l09w-12': {trackId: 'trk-tb-l09-4', start: 18.0, end: 20.62},
 'l09w-13': {trackId: 'trk-tb-l09-6', start: 0.54, end: 2.77},
 'l09w-14': {trackId: 'trk-tb-l09-6', start: 2.79, end: 5.58},
 'l09w-15': {trackId: 'trk-tb-l09-6', start: 5.6, end: 8.46},
 'l09w-16': {trackId: 'trk-tb-l09-6', start: 8.48, end: 10.5},
 'l09w-17': {trackId: 'trk-tb-l09-6', start: 10.52, end: 12.98},
 'l09w-18': {trackId: 'trk-tb-l09-6', start: 13.0, end: 15.28},
 'l09w-19': {trackId: 'trk-tb-l09-6', start: 15.3, end: 17.36},
 'l09w-20': {trackId: 'trk-tb-l09-6', start: 17.38, end: 20.03},
 'l09w-21': {trackId: 'trk-tb-l09-6', start: 20.05, end: 22.72},
 'l09w-22': {trackId: 'trk-tb-l09-6', start: 22.74, end: 25.01},
 'l09w-23': {trackId: 'trk-tb-l09-6', start: 25.03, end: 26.84},
 // hsk1-l10
 'l10w-1': {trackId: 'trk-tb-l10-2', start: 0.26, end: 2.93},
 'l10w-2': {trackId: 'trk-tb-l10-2', start: 2.95, end: 6.28},
 'l10w-3': {trackId: 'trk-tb-l10-2', start: 6.3, end: 8.79},
 'l10w-4': {trackId: 'trk-tb-l10-2', start: 8.81, end: 11.16},
 'l10w-5': {trackId: 'trk-tb-l10-2', start: 11.18, end: 13.83},
 'l10w-6': {trackId: 'trk-tb-l10-2', start: 13.85, end: 16.11},
 'l10w-7': {trackId: 'trk-tb-l10-2', start: 16.13, end: 18.43},
 'l10w-8': {trackId: 'trk-tb-l10-4', start: 0.45, end: 2.54},
 'l10w-9': {trackId: 'trk-tb-l10-4', start: 2.56, end: 5.4},
 'l10w-10': {trackId: 'trk-tb-l10-4', start: 5.42, end: 7.69},
 'l10w-11': {trackId: 'trk-tb-l10-4', start: 7.71, end: 9.73},
 'l10w-12': {trackId: 'trk-tb-l10-4', start: 9.75, end: 12.72},
 'l10w-13': {trackId: 'trk-tb-l10-4', start: 12.74, end: 15.24},
 'l10w-14': {trackId: 'trk-tb-l10-6', start: 0.16, end: 3.02},
 'l10w-15': {trackId: 'trk-tb-l10-6', start: 3.04, end: 5.84},
 'l10w-16': {trackId: 'trk-tb-l10-6', start: 5.86, end: 8.04},
 'l10w-17': {trackId: 'trk-tb-l10-6', start: 8.06, end: 10.42},
 'l10w-18': {trackId: 'trk-tb-l10-6', start: 10.44, end: 13.02},
 'l10w-19': {trackId: 'trk-tb-l10-6', start: 13.04, end: 15.22},
 'l10w-20': {trackId: 'trk-tb-l10-6', start: 15.24, end: 17.6},
 'l10w-21': {trackId: 'trk-tb-l10-6', start: 17.62, end: 20.0},
 'l10w-22': {trackId: 'trk-tb-l10-6', start: 20.02, end: 22.23},
 'l10w-23': {trackId: 'trk-tb-l10-6', start: 22.25, end: 24.04},
 // hsk1-l11
 'l11w-1': {trackId: 'trk-tb-l11-2', start: 0.29, end: 3.02},
 'l11w-2': {trackId: 'trk-tb-l11-2', start: 3.04, end: 5.85},
 'l11w-3': {trackId: 'trk-tb-l11-2', start: 5.87, end: 8.61},
 'l11w-4': {trackId: 'trk-tb-l11-2', start: 8.63, end: 11.53},
 'l11w-5': {trackId: 'trk-tb-l11-2', start: 11.55, end: 13.87},
 'l11w-6': {trackId: 'trk-tb-l11-2', start: 13.89, end: 16.73},
 'l11w-7': {trackId: 'trk-tb-l11-2', start: 16.75, end: 18.58},
 'l11w-8': {trackId: 'trk-tb-l11-4', start: 0.28, end: 2.42},
 'l11w-9': {trackId: 'trk-tb-l11-4', start: 2.44, end: 4.53},
 'l11w-10': {trackId: 'trk-tb-l11-4', start: 4.55, end: 7.39},
 'l11w-11': {trackId: 'trk-tb-l11-4', start: 7.41, end: 10.65},
 'l11w-12': {trackId: 'trk-tb-l11-4', start: 10.67, end: 12.81},
 'l11w-13': {trackId: 'trk-tb-l11-4', start: 12.83, end: 14.5},
 'l11w-14': {trackId: 'trk-tb-l11-6', start: 0.47, end: 2.93},
 'l11w-15': {trackId: 'trk-tb-l11-6', start: 2.95, end: 5.8},
 'l11w-16': {trackId: 'trk-tb-l11-6', start: 5.82, end: 8.86},
 'l11w-17': {trackId: 'trk-tb-l11-6', start: 8.88, end: 11.25},
 'l11w-18': {trackId: 'trk-tb-l11-6', start: 11.27, end: 14.45},
 'l11w-19': {trackId: 'trk-tb-l11-6', start: 14.47, end: 17.4},
 'l11w-20': {trackId: 'trk-tb-l11-6', start: 17.42, end: 20.32},
 'l11w-21': {trackId: 'trk-tb-l11-6', start: 20.34, end: 22.72},
 'l11w-22': {trackId: 'trk-tb-l11-6', start: 22.74, end: 24.95},
 'l11w-23': {trackId: 'trk-tb-l11-6', start: 24.97, end: 27.39},
 'l11w-24': {trackId: 'trk-tb-l11-6', start: 27.41, end: 29.63},
 'l11w-25': {trackId: 'trk-tb-l11-6', start: 29.65, end: 32.82},
 // hsk1-l12
 'l12w-1': {trackId: 'trk-tb-l12-2', start: 0.16, end: 3.16},
 'l12w-2': {trackId: 'trk-tb-l12-2', start: 3.18, end: 6.0},
 'l12w-3': {trackId: 'trk-tb-l12-2', start: 6.02, end: 8.17},
 'l12w-4': {trackId: 'trk-tb-l12-2', start: 8.19, end: 11.23},
 'l12w-5': {trackId: 'trk-tb-l12-2', start: 11.25, end: 13.21},
 'l12w-6': {trackId: 'trk-tb-l12-2', start: 13.23, end: 15.32},
 'l12w-7': {trackId: 'trk-tb-l12-2', start: 15.34, end: 18.17},
 'l12w-8': {trackId: 'trk-tb-l12-2', start: 18.19, end: 20.63},
 'l12w-9': {trackId: 'trk-tb-l12-2', start: 20.65, end: 22.58},
 'l12w-10': {trackId: 'trk-tb-l12-4', start: 0.19, end: 2.35},
 'l12w-11': {trackId: 'trk-tb-l12-4', start: 2.37, end: 4.9},
 'l12w-12': {trackId: 'trk-tb-l12-4', start: 4.92, end: 7.13},
 'l12w-13': {trackId: 'trk-tb-l12-4', start: 7.15, end: 9.89},
 'l12w-14': {trackId: 'trk-tb-l12-4', start: 9.91, end: 13.12},
 'l12w-15': {trackId: 'trk-tb-l12-4', start: 13.14, end: 15.74},
 'l12w-16': {trackId: 'trk-tb-l12-6', start: 0.3, end: 3.32},
 'l12w-17': {trackId: 'trk-tb-l12-6', start: 3.34, end: 6.58},
 'l12w-18': {trackId: 'trk-tb-l12-6', start: 6.6, end: 9.01},
 'l12w-19': {trackId: 'trk-tb-l12-6', start: 9.03, end: 11.49},
 'l12w-20': {trackId: 'trk-tb-l12-6', start: 11.51, end: 13.94},
 'l12w-21': {trackId: 'trk-tb-l12-6', start: 13.96, end: 16.25},
 'l12w-22': {trackId: 'trk-tb-l12-6', start: 16.27, end: 18.5},
 'l12w-23': {trackId: 'trk-tb-l12-6', start: 18.52, end: 21.05},
 'l12w-24': {trackId: 'trk-tb-l12-6', start: 21.07, end: 23.64},
 // hsk1-l13
 'l13w-1': {trackId: 'trk-tb-l13-2', start: 0.31, end: 3.71},
 'l13w-2': {trackId: 'trk-tb-l13-2', start: 3.73, end: 5.81},
 'l13w-3': {trackId: 'trk-tb-l13-2', start: 5.83, end: 9.06},
 'l13w-4': {trackId: 'trk-tb-l13-2', start: 9.08, end: 11.49},
 'l13w-5': {trackId: 'trk-tb-l13-2', start: 11.51, end: 15.25},
 'l13w-6': {trackId: 'trk-tb-l13-2', start: 15.27, end: 17.6},
 'l13w-7': {trackId: 'trk-tb-l13-4', start: 0.64, end: 3.95},
 'l13w-8': {trackId: 'trk-tb-l13-4', start: 3.97, end: 6.77},
 'l13w-9': {trackId: 'trk-tb-l13-4', start: 6.79, end: 9.24},
 'l13w-10': {trackId: 'trk-tb-l13-4', start: 9.26, end: 11.63},
 'l13w-11': {trackId: 'trk-tb-l13-4', start: 11.65, end: 14.13},
 'l13w-12': {trackId: 'trk-tb-l13-4', start: 14.15, end: 16.46},
 'l13w-13': {trackId: 'trk-tb-l13-4', start: 16.48, end: 18.79},
 'l13w-14': {trackId: 'trk-tb-l13-4', start: 18.81, end: 21.26},
 'l13w-15': {trackId: 'trk-tb-l13-4', start: 21.28, end: 23.92},
 'l13w-16': {trackId: 'trk-tb-l13-4', start: 23.94, end: 26.95},
 'l13w-17': {trackId: 'trk-tb-l13-4', start: 26.97, end: 29.38},
 'l13w-18': {trackId: 'trk-tb-l13-6', start: 0.1, end: 2.86},
 'l13w-19': {trackId: 'trk-tb-l13-6', start: 2.88, end: 5.67},
 'l13w-20': {trackId: 'trk-tb-l13-6', start: 5.69, end: 7.53},
 // hsk1-l14
 'l14w-1': {trackId: 'trk-tb-l14-2', start: 0.38, end: 2.78},
 'l14w-2': {trackId: 'trk-tb-l14-2', start: 2.8, end: 5.66},
 'l14w-3': {trackId: 'trk-tb-l14-2', start: 5.68, end: 8.75},
 'l14w-4': {trackId: 'trk-tb-l14-2', start: 8.77, end: 11.03},
 'l14w-5': {trackId: 'trk-tb-l14-2', start: 11.05, end: 13.73},
 'l14w-6': {trackId: 'trk-tb-l14-2', start: 13.75, end: 16.33},
 'l14w-7': {trackId: 'trk-tb-l14-2', start: 16.35, end: 17.53},
 'l14w-8': {trackId: 'trk-tb-l14-4', start: 0.44, end: 3.09},
 'l14w-9': {trackId: 'trk-tb-l14-4', start: 3.11, end: 5.5},
 'l14w-10': {trackId: 'trk-tb-l14-4', start: 5.52, end: 8.56},
 'l14w-11': {trackId: 'trk-tb-l14-4', start: 8.58, end: 11.45},
 'l14w-12': {trackId: 'trk-tb-l14-4', start: 11.47, end: 14.47},
 'l14w-13': {trackId: 'trk-tb-l14-4', start: 14.49, end: 16.77},
 'l14w-14': {trackId: 'trk-tb-l14-4', start: 16.79, end: 19.7},
 'l14w-15': {trackId: 'trk-tb-l14-4', start: 19.72, end: 21.81},
 'l14w-p1': {trackId: 'trk-tb-l14-4', start: 21.83, end: 24.56},
 'l14w-p2': {trackId: 'trk-tb-l14-4', start: 24.58, end: 27.1},
 'l14w-16': {trackId: 'trk-tb-l14-6', start: 0.36, end: 3.31},
 'l14w-17': {trackId: 'trk-tb-l14-6', start: 3.33, end: 5.7},
 'l14w-18': {trackId: 'trk-tb-l14-6', start: 5.72, end: 8.53},
 'l14w-19': {trackId: 'trk-tb-l14-6', start: 8.55, end: 11.65},
 'l14w-20': {trackId: 'trk-tb-l14-6', start: 11.67, end: 15.04},
 'l14w-21': {trackId: 'trk-tb-l14-6', start: 15.06, end: 18.53},
 'l14w-22': {trackId: 'trk-tb-l14-6', start: 18.55, end: 21.29},
 'l14w-23': {trackId: 'trk-tb-l14-6', start: 21.31, end: 23.9},
 'l14w-24': {trackId: 'trk-tb-l14-6', start: 23.92, end: 26.55},
 'l14w-25': {trackId: 'trk-tb-l14-6', start: 26.57, end: 29.24},
 'l14w-26': {trackId: 'trk-tb-l14-6', start: 29.26, end: 31.33},
 // hsk1-l15
 'l15-w01': {trackId: 'trk-tb-l15-2', start: 0.25, end: 3.06},
 'l15-w02': {trackId: 'trk-tb-l15-2', start: 3.08, end: 5.13},
 'l15-w03': {trackId: 'trk-tb-l15-4', start: 0.23, end: 3.32},
 'l15-w04': {trackId: 'trk-tb-l15-4', start: 3.34, end: 6.41},
 'l15-w05': {trackId: 'trk-tb-l15-4', start: 6.43, end: 8.77},
 'l15-w06': {trackId: 'trk-tb-l15-4', start: 8.79, end: 10.83},
 'l15-w07': {trackId: 'trk-tb-l15-4', start: 10.85, end: 13.54},
 'l15-w08': {trackId: 'trk-tb-l15-4', start: 13.56, end: 16.31},
 'l15-w09': {trackId: 'trk-tb-l15-4', start: 16.33, end: 18.66},
 'l15-w10': {trackId: 'trk-tb-l15-6', start: 0.19, end: 3.02},
 'l15-w11': {trackId: 'trk-tb-l15-6', start: 3.04, end: 4.94},
 'l15-w12': {trackId: 'trk-tb-l15-6', start: 4.96, end: 7.72},
 'l15-w13': {trackId: 'trk-tb-l15-6', start: 7.74, end: 10.52},
 'l15-w14': {trackId: 'trk-tb-l15-6', start: 10.54, end: 13.65},
 'l15-w15': {trackId: 'trk-tb-l15-6', start: 13.67, end: 17.17},
 'l15-w16': {trackId: 'trk-tb-l15-6', start: 17.19, end: 19.4},
 'l15-w17': {trackId: 'trk-tb-l15-6', start: 19.42, end: 21.59},
 'l15-w18': {trackId: 'trk-tb-l15-6', start: 21.61, end: 23.84},
 'l15-w19': {trackId: 'trk-tb-l15-6', start: 23.86, end: 26.23},
 'l15-w20': {trackId: 'trk-tb-l15-6', start: 26.25, end: 30.41},
};

export function reviewSupported(content) {
 return !!content && REVIEW_LESSONS.includes(content.lessonId);
}
// Counts always come from the lesson's own verified data, never hardcoded.
export function reviewCounts(content) {
 const words = content.prepWords || [];
 const grammar = (content.knowledgePoints || []).filter(k => k.kind === 'grammar');
 return {
  words: words.length,
  properNames: words.filter(w => w.isProperName).length,
  grammar: grammar.length,
  passages: content.reader?.passages?.length || 0,
  sentences: content.reader?.sentences?.length || 0,
 };
}
export function reviewDetailLabel(content) {
 const c = reviewCounts(content);
 const wordPart = c.properNames ? `${c.words - c.properNames} từ + ${c.properNames} tên riêng` : `${c.words} từ`;
 return `${wordPart} + ${c.grammar} điểm ngữ pháp + ${c.passages} đoạn`;
}
// Editorial Vietnamese paraphrases of grammar patterns, keyed by knowledge
// point id. A pattern is only spoken through its paraphrase: the raw formula
// (with "+", brackets, slashes) stays on screen but is never sent to TTS as
// joined fragments. Points without a paraphrase are not read as formulas;
// their meaning, use, position and examples are still read from the lesson.
export const REVIEW_PATTERN_SPEECH = {
 'kp-hsk2-l01-ba': 'Mẫu câu: chủ ngữ đứng đầu, tiếp theo là động từ hoặc tính từ, có thể có tân ngữ, cuối câu thêm trợ từ ba để phỏng đoán và chờ người nghe xác nhận.',
 'kp-hsk2-l01-shide': 'Mẫu câu: chủ ngữ đứng đầu, rồi đến chữ thị có nghĩa là là, tiếp theo là chi tiết cần nhấn mạnh như thời gian, địa điểm, cách thức hoặc mục đích, rồi đến động từ, cuối câu là chữ đích.',
 'kp-hsk2-l01-pivotal': 'Mẫu câu kiêm ngữ: chủ ngữ đứng đầu, rồi đến một động từ có nghĩa nhờ, để cho hoặc bảo, tiếp theo là người được nhờ, rồi đến việc người đó làm. Người ở giữa vừa là tân ngữ của phần trước, vừa là chủ ngữ của phần sau.',
 'kp-hsk2-l02-haishi': 'Mẫu câu: ngay trước phương án được chọn, nói cụm có nghĩa là hay là, cuối câu thêm trợ từ ba, để gợi ý phương án tốt hơn sau khi đã cân nhắc.',
 'kp-hsk2-l02-duo': 'Mẫu số gần đúng: nếu con số là bội số của mười, đặt chữ đa có nghĩa là hơn ngay sau con số, rồi mới đến lượng từ và danh từ. Nếu con số không phải bội số của mười, đặt chữ đa sau lượng từ.',
 'kp-hsk2-l02-attributive': 'Mẫu định ngữ: đặt động từ, cụm động từ hoặc cả cụm chủ ngữ và động từ ở trước, tiếp theo là chữ đích, rồi mới đến danh từ được bổ nghĩa. Định ngữ đứng trước danh từ, không đứng sau danh từ như tiếng Việt.',
 'kp-hsk2-l03-result': 'Mẫu câu: động từ đứng trước, ngay sau đó đặt một động từ hoặc tính từ để nói kết quả của hành động, như làm xong xuôi, ăn hết, đến muộn hay nghe hiểu. Cuối câu có thể thêm một trợ từ để nói việc đã hoàn thành. Khi phủ định, đặt một từ có nghĩa là chưa ngay trước động từ và bỏ trợ từ ở cuối câu.',
 'kp-hsk2-l03-redup1': 'Mẫu trùng điệp cho việc sắp làm: với động từ một âm tiết, lặp lại động từ đó, có thể chêm chữ nhất, nghĩa là một, ở giữa. Với động từ hai âm tiết, lặp lại cả cụm hai âm tiết. Với động từ ly hợp, chỉ lặp lại âm tiết đầu rồi mới nói phần còn lại. Cách lặp này có nghĩa làm một chút, thử làm, nghe nhẹ nhàng.',
 'kp-hsk2-l03-redup2': 'Mẫu trùng điệp cho việc đã làm: với động từ một âm tiết, chêm trợ từ chỉ việc đã xảy ra vào giữa hai lần lặp của động từ. Với động từ hai âm tiết, thường không lặp lại, mà dùng nguyên động từ rồi thêm cụm có nghĩa là một chút ở sau. Với động từ ly hợp, chêm trợ từ đã vào sau âm tiết đầu, rồi mới nói phần còn lại.',
 'kp-hsk2-l04-guo': 'Mẫu câu: đặt một trợ từ chỉ trải nghiệm ngay sau động từ, rồi mới đến tân ngữ, để nói một việc đã từng xảy ra trong quá khứ. Khi phủ định, đặt một từ có nghĩa là chưa từng ngay trước động từ. Khi hỏi, thêm một trợ từ hỏi ở cuối câu, hoặc lặp lại động từ quanh từ phủ định đó.',
 'kp-hsk2-l04-yinwei': 'Mẫu câu nhân quả: mở đầu vế nguyên nhân bằng một liên từ có nghĩa là vì, mở đầu vế kết quả bằng một liên từ có nghĩa là cho nên. Có thể dùng cả cặp liên từ trong cùng một câu, hoặc chỉ dùng một trong hai liên từ.',
 'kp-hsk2-l04-de': 'Mẫu cụm miêu tả: đặt phần miêu tả như màu sắc, tính chất hoặc hành động ở trước, tiếp theo là một trợ từ kết cấu, rồi mới đến danh từ được chỉ tới. Khi ngữ cảnh đã rõ đang nói về vật gì, có thể lược bỏ danh từ và chỉ giữ lại phần miêu tả cùng trợ từ đó.',
 // D35: HSK 1 grammar points, paraphrased from each point's verified
 // pattern, position and explanation in the lesson data.
 'kp-hsk1-l01-men': 'Mẫu câu: để nói về một nhóm người, thêm trợ từ chỉ số nhiều ngay sau đại từ hoặc danh từ chỉ người; trợ từ này không đứng một mình.',
 'kp-hsk1-l02-jiao': 'Mẫu câu: khi trả lời tên, nói chủ ngữ trước, rồi đến động từ có nghĩa là được gọi là, sau cùng là tên của mình. Khi hỏi tên, mở đầu bằng cụm xin hỏi lịch sự rồi hỏi bạn tên là gì.',
 'kp-hsk1-l02-shi': 'Mẫu câu: chủ ngữ đứng đầu, tiếp theo là động từ có nghĩa là là, rồi đến danh từ chỉ người hoặc nhóm. Muốn phủ định, đặt từ phủ định ngay trước động từ đó.',
 'kp-hsk1-l02-word-order': 'Mẫu câu: trật tự cơ bản của câu là chủ ngữ đứng đầu, tiếp theo là động từ, cuối cùng là tân ngữ chịu tác động của hành động; xếp theo thứ tự ai làm gì với ai hoặc với cái gì.',
 'kp-hsk1-l03-shi': 'Mẫu câu: chủ ngữ đứng đầu, rồi đến động từ có nghĩa là là, tiếp theo là danh từ chỉ quốc tịch, nghề nghiệp hoặc nhóm. Phủ định thì đặt từ phủ định ngay trước động từ.',
 'kp-hsk1-l03-de': 'Mẫu câu: trợ từ chỉ quan hệ của đứng giữa phần sở hữu và danh từ chính: phần sở hữu ở trước, trợ từ ở giữa, danh từ chính ở sau. Nếu phần sở hữu là đại từ nhân xưng và danh từ sau là người thân hoặc người quen, có thể bỏ trợ từ này.',
 'kp-hsk1-l03-ma': 'Mẫu câu: lấy nguyên một câu trần thuật rồi thêm trợ từ hỏi ở cuối câu, thành câu hỏi chỉ cần trả lời đúng hoặc không. Trợ từ hỏi luôn đứng cuối câu.',
 'kp-hsk1-l04-you': 'Mẫu câu: chủ ngữ đứng đầu, tiếp theo là động từ có nghĩa là có, rồi đến số lượng và danh từ. Phủ định của động từ có dùng một từ riêng đặt ngay trước phần bị phủ định, không dùng từ phủ định thông thường. Hỏi bao nhiêu thì dùng từ hỏi số lượng kèm lượng từ.',
 'kp-hsk1-l04-numbers': 'Mẫu đọc số: ghép số theo hàng từ lớn xuống nhỏ: hàng nghìn, hàng trăm, hàng chục rồi hàng đơn vị; hàng trống ở giữa được lấp bằng số không. Riêng số hai: khi đếm số và nói thứ tự đọc một cách, khi đứng trước lượng từ đọc cách khác.',
 'kp-hsk1-l04-ne': 'Mẫu câu: nêu tình huống của một người trước, sau đó nhắc tên người hoặc vật thứ hai rồi thêm trợ từ hỏi ở cuối, nghĩa là còn người đó thì sao. Trợ từ này chỉ đứng cuối câu hỏi đáp lại.',
 'kp-hsk1-l04-measure': 'Mẫu câu: khi đếm người hoặc vật, đặt số từ trước, tiếp theo là lượng từ, cuối cùng là danh từ; không bỏ lượng từ giữa số và danh từ. Đếm thành viên trong gia đình dùng một lượng từ riêng, đếm chung dùng lượng từ chung.',
 'kp-hsk1-l05-time': 'Mẫu câu: nói ngày tháng theo thứ tự từ lớn xuống nhỏ: năm trước, rồi đến tháng, ngày, cuối cùng là thứ. Thứ tự này ngược với cách nói ngày tháng của tiếng Việt.',
 'kp-hsk1-l05-nominal-predicate': 'Mẫu câu: khi nói ngày tháng hoặc tuổi, đặt cụm danh từ ngay sau chủ ngữ làm vị ngữ, thường không cần động từ là.',
 'kp-hsk1-l05-hui': 'Mẫu câu: chủ ngữ đứng đầu, tiếp theo là động từ có nghĩa là biết làm do học mà biết, rồi đến động từ chỉ việc đó và tân ngữ nếu có. Phủ định thì đặt từ phủ định ngay trước động từ biết làm.',
 'kp-hsk1-l06-xiang': 'Mẫu câu: chủ ngữ đứng đầu, tiếp theo là động từ năng nguyện có nghĩa là muốn hoặc dự định, rồi đến động từ chỉ việc muốn làm và tân ngữ nếu có. Phủ định thì đặt từ phủ định ngay trước động từ năng nguyện.',
 'kp-hsk1-l06-serial': 'Mẫu câu: hai cụm động từ nối liền nhau, không có từ nối ở giữa, theo đúng trình tự hành động: cụm đầu nói việc di chuyển hoặc cách đi, cụm sau nói mục đích hoặc việc tiếp theo.',
 'kp-hsk1-l06-zenme': 'Mẫu câu: chủ ngữ đứng đầu, tiếp theo là từ nghi vấn hỏi cách thức, rồi đến động từ và tân ngữ; từ nghi vấn đứng trước động từ, không đứng cuối câu.',
 'kp-hsk1-l07-time2': 'Mẫu câu: nói giờ cụ thể bằng số giờ rồi đến từ chỉ giờ, sau đó số phút rồi đến từ chỉ phút; từ chỉ buổi như sáng, trưa, chiều, tối đứng trước điểm giờ. Phút dưới mười phải đọc thêm số không ở giữa; đúng mười phút thì không được bỏ từ chỉ phút.',
 'kp-hsk1-l07-ba': 'Mẫu câu: lấy một câu trần thuật rồi thêm trợ từ ngữ khí đọc thanh nhẹ ở cuối câu, thành lời đề nghị, rủ rê hoặc khuyên nhủ. Trợ từ này luôn đứng cuối câu.',
 'kp-hsk1-l07-adverbial': 'Mẫu câu: chủ ngữ đứng đầu, tiếp theo là từ chỉ thời gian hoặc phó từ làm trạng ngữ, cuối cùng mới đến động từ hoặc tính từ. Trạng ngữ đứng trước động từ, không đặt ở cuối câu như tiếng Việt.',
 'kp-hsk1-l07-ne': 'Mẫu câu: lấy một câu trần thuật rồi thêm trợ từ ở cuối câu để khẳng định sự việc là thật, đang diễn ra như vậy. Trợ từ này khác với trợ từ cùng hình thức trong câu hỏi đáp lại đã học trước đây.',
 'kp-hsk1-l08-positional': 'Mẫu câu: nói vị trí bằng cách đặt danh từ chỉ nơi chốn trước, rồi thêm từ chỉ phía ở ngay sau: phía trên, phía dưới, bên trong, bên ngoài, phía trước hoặc phía sau. Từ chỉ phía đứng sau danh từ, ngược với thứ tự của tiếng Việt.',
 'kp-hsk1-l08-zai': 'Mẫu câu: để nói làm việc gì ở đâu, đặt cụm chỉ nơi chốn trước động từ: giới từ có nghĩa là ở, tiếp theo là nơi chốn, rồi mới đến việc làm. Không đặt nơi chốn ở cuối câu.',
 'kp-hsk1-l08-neng': 'Mẫu câu: đặt động từ có nghĩa là có thể, làm được, ngay trước động từ chỉ việc làm. Phủ định thì dùng dạng phủ định của nó, đứng ngay trước động từ. Hỏi có làm được không thì thêm trợ từ hỏi ở cuối câu.',
 'kp-hsk1-l08-tip-measure': 'Mẫu câu: đại từ chỉ định có nghĩa là này hoặc kia đặt trước, tiếp theo là lượng từ, cuối cùng là danh từ; vị trí giống như cụm số từ với lượng từ.',
 'kp-hsk1-l08-tip-xiao': 'Mẫu gọi thân mật: đặt một chữ có nghĩa là nhỏ ngay trước họ của người trẻ tuổi hơn, khi quan hệ đủ thân quen. Hoàn cảnh trang trọng hoặc với người lớn tuổi hơn thì dùng họ kèm chức danh.',
 'kp-hsk1-l09-existential-1': 'Mẫu câu: nơi chốn đứng đầu câu, tiếp theo là động từ có nghĩa là có hoặc là, rồi đến số lượng và danh từ chỉ người hoặc vật ở nơi đó. Khi phủ định, bỏ cụm số lượng và dùng dạng phủ định của động từ có.',
 'kp-hsk1-l09-time-place-order': 'Mẫu câu: khi câu có cả thời gian và nơi chốn làm trạng ngữ, xếp chủ ngữ trước, rồi đến thời gian, tiếp theo là cụm chỉ nơi chốn, cuối cùng là hành động; thời gian luôn đứng trước nơi chốn.',
 'kp-hsk1-l09-ordinal-di': 'Mẫu câu: để nói số thứ tự, đặt một trợ từ chỉ thứ tự ngay trước số đếm; sau số có thể thêm lượng từ và danh từ. Cách này khác số đếm thường dùng để đếm số lượng.',
 'kp-hsk1-l10-money': 'Mẫu đọc số tiền: đọc từ đơn vị lớn xuống nhỏ: đơn vị tiền chính trước, rồi đến phần mười, cuối cùng là phần trăm; trong khẩu ngữ, ba đơn vị này có tên gọi riêng ngắn hơn. Số không ở giữa phải đọc ra; phần cuối bằng không thì bỏ qua.',
 'kp-hsk1-l10-adj-predicate': 'Mẫu câu: tính từ làm vị ngữ trực tiếp ngay sau chủ ngữ, không cần động từ là ở giữa. Trước tính từ có thể đặt phó từ chỉ mức độ như thật, rất, quá, hoặc từ phủ định.',
 'kp-hsk1-l10-zenmeyang': 'Mẫu câu: để hỏi ý kiến hoặc tình trạng, nhắc người hoặc vật cần hỏi trước, rồi thêm từ nghi vấn có nghĩa là thế nào ở cuối. Người được hỏi trả lời bằng một nhận xét.',
 'kp-hsk1-l11-affirm-neg': 'Mẫu câu hỏi chính phủ: lặp lại động từ hoặc tính từ hai lần, ở giữa chêm từ phủ định: làm hay không làm, bận hay không bận. Với động từ, từ phủ định có thể là không hoặc chưa; với tính từ chỉ dùng không. Trả lời bằng cách nhắc lại phần khẳng định hoặc phủ định.',
 'kp-hsk1-l11-progressive': 'Mẫu câu: để nói việc đang diễn ra, đặt phó từ có nghĩa là đang ngay trước động từ; có thể thêm trợ từ ở cuối câu, hoặc chỉ đặt trợ từ đó ngay sau động từ. Phủ định thì dùng từ có nghĩa là chưa đặt trước động từ.',
 'kp-hsk1-l11-yao': 'Mẫu câu: chủ ngữ đứng đầu, tiếp theo là động từ năng nguyện có nghĩa là muốn hoặc dự định, rồi đến động từ chỉ việc muốn làm và tân ngữ nếu có.',
 'kp-hsk1-l12-non-subject': 'Mẫu câu: chỉ một từ hoặc một cụm từ cũng thành câu hoàn chỉnh, không cần chủ ngữ; dùng để báo nhanh một hiện tượng như trời mưa, tuyết rơi, hoặc thốt lên một cảm xúc.',
 'kp-hsk1-l12-le': 'Mẫu câu: thêm trợ từ ở cuối câu, hoặc ở chỗ ngắt giữa câu, để báo tình hình đã thay đổi hoặc vừa xuất hiện điều mới. Khi phủ định một việc chưa xảy ra, dùng từ có nghĩa là chưa trước động từ và bỏ trợ từ cuối câu.',
 'kp-hsk1-l12-tai': 'Mẫu cảm thán: đặt một từ có nghĩa là quá trước tính từ, và thêm trợ từ ở cuối câu, để thốt lên mức độ rất cao, như lạnh quá, vui quá.',
 'kp-hsk1-l13-keyi': 'Mẫu câu: chủ ngữ đứng đầu, tiếp theo là trợ động từ có nghĩa là có thể hoặc được phép, rồi đến động từ và tân ngữ nếu có. Phủ định thì đặt từ phủ định ngay trước trợ động từ. Khi đồng ý ngắn gọn, chỉ cần nói lại trợ động từ đó.',
 'kp-hsk1-l13-yixia': 'Mẫu câu: đặt cụm có nghĩa là một chút, một lần, ngay sau động từ, để nói làm thử hoặc làm trong thời gian ngắn; cách nói này làm lời yêu cầu nghe mềm và lịch sự hơn.',
 'kp-hsk1-l13-double-object': 'Mẫu câu hai tân ngữ: chủ ngữ đứng đầu, tiếp theo là động từ cho hoặc hỏi, rồi đến tân ngữ chỉ người, cuối cùng là tân ngữ chỉ vật hoặc nội dung câu hỏi.',
 'kp-hsk1-l14-le2': 'Mẫu câu: đặt trợ từ ngay sau động từ để nói hành động đã xảy ra hoặc đã hoàn thành; sau trợ từ có thể có tân ngữ. Khi phủ định, dùng từ có nghĩa là chưa trước động từ và bỏ trợ từ này. Trợ từ này bám ngay sau động từ, khác với trợ từ cùng hình thức ở cuối câu đã học ở bài trước.',
 'kp-hsk1-l14-separable': 'Mẫu từ ly hợp: một số từ gồm hai phần hợp lại thành một từ, nhưng có thể tách ra và chèn thành phần khác vào giữa, như trợ từ chỉ việc đã xảy ra, lượng từ hoặc tân ngữ, khi kể việc đã qua hoặc nói rõ số lượng.',
 'kp-hsk1-l14-dou': 'Mẫu câu: đối tượng được nói tới toàn bộ đứng trước, tiếp theo là phó từ có nghĩa là đều, tất cả, rồi đến động từ. Khi phủ định, từ phủ định đứng sau phó từ này.',
 'kp-hsk1-l15-coordinate': 'Mẫu câu ghép song song: vế đầu nói một điều, sau dấu phẩy vế sau bắt đầu bằng một phó từ có nghĩa là còn hoặc cũng, để thêm một điều song song cùng chiều. Hai vế thường có cấu trúc giống nhau và cùng một chủ ngữ.',
};
// Only strip presentation/source annotations, never arbitrary lesson vocabulary.
export function cleanReviewText(text) {
 return String(text || '')
  .replace(/[（(][^()（）]*(?:ví dụ trong sách|ví dụ ở sách|Textbook|Workbook|trong Đoạn|trong sách|tr\.\s*\d)[^()（）]*[）)]/giu, '')
  .replace(/\s+[（(]\d+[）)](?=\s*[:：])/gu, '')
  .replace(/\s+/gu, ' ').trim();
}
export function reviewSpeechText(text) {
 // Symbols are never sent to the device: some engines pronounce their names.
 // Boundaries become whitespace so adjacent words are not joined accidentally.
 return cleanReviewText(text).replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ').replace(/\s+/gu, ' ').trim();
}
// Timing is handled by the player, not by asking the voice to pronounce marks.
export function reviewSpeechChunks(text) {
 const input = cleanReviewText(text), chunks = [];
 let start = 0;
 for (const match of input.matchAll(/[.!?。！？…]+|[,，、;；:：]+/gu)) {
  const at = match.index, mark = match[0];
  // A decimal point is not a sentence boundary.
  if (mark === '.' && /\d/u.test(input[at-1] || '') && /\d/u.test(input[at+1] || '')) continue;
  const spoken = reviewSpeechText(input.slice(start, at));
  const pauseMs = /[.!?。！？…]/u.test(mark) ? 750 : /[;；:：]/u.test(mark) ? 450 : 300;
  if (spoken) chunks.push({text:spoken, pauseMs});
  else if (chunks.length) chunks.at(-1).pauseMs = Math.max(chunks.at(-1).pauseMs,pauseMs);
  start = at + mark.length;
 }
 const tail = reviewSpeechText(input.slice(start));
 if (tail) chunks.push({text:tail,pauseMs:0});
 return chunks;
}
export function buildReview(content, mode = 'quick') {
 if (!reviewSupported(content)) return [];
 const rows = [];
 let groupCounter = 0;
 const add = (label, text, source, group = ++groupCounter, paragraph = 0) => {
  const display = cleanReviewText(text);
  // Keep the complete paragraph for the transcript; sanitize speech separately.
  const parts = display.split(/([\p{Script=Han}][\p{Script=Han}，。！？、：“”‘’…]*)/u);
  let prefix = "";
  for (const part of parts) {
   const speechText = reviewSpeechText(part);
   if (!speechText) {
    const previous = rows.at(-1);
    if (previous?.group === group && previous.paragraph === paragraph) previous.displayText += part;
    else prefix += part;
    continue;
   }
   rows.push({label, text: part.trim(), displayText: prefix + part, speechText, group, paragraph,
    lang: /\p{Script=Han}/u.test(part) ? 'zh-CN' : 'vi-VN', source});
   prefix = '';
  }
  return group;
 };
 // D33 (Hoa, 2026-11-08): units that already have book audio (words and
 // dialogue lines, as {trackId, start, end} refs into reader.audioTracks)
 // play the real streamed segment in the review; everything else keeps
 // device TTS. The first fragment row carries the segment; later fragments
 // of the same unit are marked covered so the segment is never replayed
 // or spoken twice.
 const trackById = new Map((content.reader.audioTracks || []).map(t => [t.id, t]));
 const resolveAudio = ref => {
  const track = ref?.trackId && trackById.get(ref.trackId);
  if (!track?.url || !(ref.end > ref.start)) return null;
  return {trackId: ref.trackId, url: track.url, start: ref.start, end: ref.end};
 };
 const pair = (label, zh, vi, source, audioRef) => {
  const group = ++groupCounter;
  const before = rows.length;
  add(label, zh, source, group, 0);
  const segment = resolveAudio(audioRef);
  if (segment) for (let i = before; i < rows.length; i++) {
   if (i === before) rows[i].audio = segment; else rows[i].coveredByAudio = true;
  }
  add(label, vi, source, group, 1);
 };
 if (mode === 'detail') {
  add('Từ mới', 'Ôn từ mới. Nghe tiếng Trung, rồi nghe nghĩa tiếng Việt.', 'editorial-intro');
  for (const w of content.prepWords) {
   const full = REVIEW_WORD_SEGMENTS[w.id];
   pair('Từ mới · ' + w.zh, w.zh, w.vi, w.id, full ? {...(w.audio || {}), ...full} : w.audio);
  }
  for (const k of content.knowledgePoints.filter(k => k.kind === 'grammar')) {
   const titleGroup = add('Cách dùng', k.title, k.id);
   // The printed formula stays visible in full; only its Vietnamese
   // paraphrase is spoken, never the joined formula fragments.
   const paraphrase = REVIEW_PATTERN_SPEECH[k.id];
   if (k.pattern && paraphrase) {
    rows.push({label: 'Mẫu câu', text: k.pattern, displayText: k.pattern, speechText: reviewSpeechText(paraphrase), speechSource: paraphrase, group: titleGroup, paragraph: 1, lang: 'vi-VN', source: k.id});
   }
   add('Cách dùng', k.useWhenVi, k.id);
   add('Giải thích', k.explanationVi, k.id);
   add('Vị trí', k.positionVi, k.id);
   for (const e of k.examples) pair('Câu mẫu', e.zh, e.noteVi, k.id);
  }
  for (const p of content.reader.passages) {
   add('Hội thoại', p.title, p.id);
   for (const id of p.sentenceIds) {
    const s = content.reader.sentences.find(s => s.id === id);
    pair(s.speaker ? `${p.title} · ${s.speaker}` : p.title, s.zh, s.vi, s.id, s.audio);
   }
  }
 } else {
  // D32 (Hoa, 2026-11-08): Ôn nhanh chỉ gồm ý chính của các điểm ngữ pháp —
  // tên điểm, "dùng khi nào", mẫu câu (đọc bằng lời giải thích tiếng Việt)
  // và một câu mẫu. Từ mới, hội thoại và điểm tổng kết chỉ có ở Ôn chi tiết.
  add('Mở đầu', 'Ôn nhanh. Nghe ý chính của từng điểm ngữ pháp: dùng khi nào, mẫu câu và một câu mẫu.', 'editorial-intro');
  for (const k of content.knowledgePoints.filter(k => k.kind === 'grammar')) {
   const titleGroup = add('Điểm ngữ pháp', k.title, k.id);
   add('Ý chính', k.useWhenVi, k.id);
   const paraphrase = REVIEW_PATTERN_SPEECH[k.id];
   if (k.pattern && paraphrase) {
    rows.push({label: 'Mẫu câu', text: k.pattern, displayText: k.pattern, speechText: reviewSpeechText(paraphrase), speechSource: paraphrase, group: titleGroup, paragraph: 1, lang: 'vi-VN', source: k.id});
   }
   const e = k.examples?.[0];
   if (e) pair('Câu mẫu', e.zh, e.noteVi, k.id);
  }
 }
 add('Kết thúc', 'Đã ôn xong. Bạn có thể nghe lại hoặc trở về bài học.', 'editorial-outro');
 return rows;
}

export function createReviewPlayer({synth, Utterance, beforePlay = () => {}, changed = () => {}, schedule = setTimeout, unschedule = clearTimeout, audioFactory = null}) {
 let queue = [], index = 0, status = 'idle', error = '', token = 0, timer, watchdog, utterance;
 let rate = 0.92, gap = 0, loop = false;
 let seg = null, segCleanup = null;
 const state = () => ({queue, index, status, error});
 const emit = () => changed(state());
 function cancel() { token++; unschedule(timer); unschedule(watchdog); if (utterance) { utterance.onstart = null; utterance.onend = null; utterance.onerror = null; } synth?.cancel(); utterance = null; if (segCleanup) { segCleanup(); segCleanup = null; } if (seg) { try { seg.pause(); } catch { /* element gone */ } } }
 function stop() { cancel(); status = 'idle'; error = ''; emit(); }
 function play() {
  cancel(); error = '';
  const voices = synth?.getVoices?.() || [];
  const select = lang => voices.find(v => v.lang.replace('_','-').toLowerCase() === lang.toLowerCase()) || voices.find(v => lang === 'zh-CN' ? /^(zh-(cn|sg|tw)|cmn)(-|$)/i.test(v.lang.replace('_','-')) : /^vi(-|$)/i.test(v.lang));
  if (!queue.length) return;
  status = 'playing'; beforePlay(); const mine = token; let chunkIndex = 0;
  const segmentTried = new Set();
  const rowEndPause = row => {
   const chunks = reviewSpeechChunks(row.speechSource ?? row.displayText ?? row.text);
   let pauseMs = chunks.at(-1)?.pauseMs ?? 750;
   const following = queue[index+1];
   const newGroup = !following || following.group !== row.group;
   const newParagraph = following?.paragraph !== row.paragraph;
   return Math.max(pauseMs, newGroup ? Math.max(900, gap*1000) : newParagraph ? 550 : 120);
  };
  // Play the row's book-audio segment [start, end] of its track, then
  // advance with the same end-of-row pause as the TTS path. Any failure
  // (no element, load error, never starts) falls back to TTS for the row.
  const playSegment = row => {
   if (!seg) { try { seg = audioFactory ? audioFactory() : null; } catch { seg = null; } if (seg) seg.preload = 'auto'; }
   if (!seg) { next(); return; }
   synth?.cancel();
   status = 'starting'; emit();
   let done = false;
   const cleanup = () => { seg.removeEventListener?.('timeupdate', onTime); seg.removeEventListener?.('ended', finish); seg.removeEventListener?.('playing', onPlaying); seg.removeEventListener?.('error', fallback); segCleanup = null; };
   const finish = () => { if (done || mine !== token) return; done = true; cleanup(); try { seg.pause(); } catch { /* ignore */ } unschedule(watchdog); const pauseMs = rowEndPause(row); index++; chunkIndex = 0; timer = schedule(next, pauseMs); };
   const fallback = () => { if (done || mine !== token) return; done = true; cleanup(); try { seg.pause(); } catch { /* ignore */ } unschedule(watchdog); next(); };
   const onTime = () => { if (seg.currentTime >= row.audio.end - 0.03) finish(); };
   const onPlaying = () => { if (done || mine !== token) return; unschedule(watchdog); status = 'playing'; emit(); const remaining = Math.max(0, row.audio.end - Math.max(row.audio.start, seg.currentTime || row.audio.start)); watchdog = schedule(finish, remaining / rate * 1000 + 5000); };
   segCleanup = cleanup;
   seg.addEventListener?.('timeupdate', onTime); seg.addEventListener?.('ended', finish); seg.addEventListener?.('playing', onPlaying); seg.addEventListener?.('error', fallback);
   watchdog = schedule(fallback, 10000);
   try {
    if (seg.src !== row.audio.url) seg.src = row.audio.url;
    seg.playbackRate = rate;
    seg.currentTime = row.audio.start;
    const played = seg.play?.();
    if (played?.catch) played.catch(() => fallback());
   } catch { fallback(); }
  };
  const next = () => {
   if (mine !== token) return;
   if (index >= queue.length) { if (loop) index = 0; else { status = 'ended'; index = queue.length - 1; emit(); return; } }
   const row = queue[index];
   if (chunkIndex === 0 && row.coveredByAudio) { index++; next(); return; }
   if (chunkIndex === 0 && row.audio && !segmentTried.has(index)) { segmentTried.add(index); playSegment(row); return; }
   if (!Utterance || !synth?.speak) {
    status = 'error'; error = 'Trình duyệt này không hỗ trợ đọc văn bản. Hãy mở trang bằng Chrome hoặc Safari để thử lại.'; emit(); return;
   }
   const chunks = reviewSpeechChunks(row.speechSource ?? row.displayText ?? row.text);
   const chunk = chunks[chunkIndex];
   if (!chunk) { index++; chunkIndex = 0; next(); return; }
   utterance = new Utterance(chunk.text); utterance.lang = row.lang; const voice = select(row.lang); if (voice) utterance.voice = voice; utterance.rate = rate;
   // Android may expose no voices even when lang-based synthesis works.
   // Keep voice unset in that case; never force an unrelated language.
   status = 'starting';
   utterance.onstart = () => { if (mine !== token) return; unschedule(watchdog); status = 'playing'; emit(); };
   utterance.onend = () => {
    if (mine !== token) return;
    unschedule(watchdog);
    let pauseMs = chunk.pauseMs;
    chunkIndex++;
    if (chunkIndex >= chunks.length) {
     const following = queue[index+1];
     const newGroup = !following || following.group !== row.group;
     const newParagraph = following?.paragraph !== row.paragraph;
     // Optional practice gaps apply between ideas, never after every language fragment.
     pauseMs = Math.max(pauseMs, newGroup ? Math.max(900,gap*1000) : newParagraph ? 550 : 120);
     index++; chunkIndex = 0;
    }
    timer = schedule(next, pauseMs);
   };
   const fail = reason => { if (mine !== token) return; cancel(); status = 'error'; error = reason; emit(); };
   utterance.onerror = event => fail(event?.error === 'language-unavailable' || event?.error === 'voice-unavailable'
    ? `Máy chưa đọc được ${row.lang === 'vi-VN' ? 'tiếng Việt' : 'tiếng Trung'}. Hãy tải giọng tương ứng trong cài đặt chuyển văn bản thành giọng nói của điện thoại, rồi bấm Phát.`
    : 'Không phát được giọng đọc. Nếu đang mở trong ứng dụng ChatGPT, hãy mở link bằng Chrome rồi bấm Phát lại.');
   watchdog = schedule(() => fail('Giọng đọc không khởi động. Hãy mở link bằng Chrome và kiểm tra giọng tiếng Việt/tiếng Trung trong cài đặt chuyển văn bản thành giọng nói.'), 10000);
   emit(); try { synth.resume?.(); synth.speak(utterance); } catch { utterance.onerror(); }
  };
  next();
 }
 return {
  state, stop,
  load(rows) { stop(); queue = rows; index = 0; emit(); },
  configure(options) { rate = options.rate ?? rate; gap = options.gap ?? gap; loop = options.loop ?? loop; },
  toggle() { if (['playing','starting'].includes(status)) { cancel(); index = Math.min(index, queue.length - 1); status = 'paused'; emit(); } else { if (status === 'ended') index = 0; play(); } },
  move(delta) { const active = ['playing','starting'].includes(status); cancel(); index = Math.max(0, Math.min(queue.length - 1, index + delta)); status = 'paused'; emit(); if (active) play(); }
 };
}

const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let controller, currentContent, mode = 'quick';
let options = {rate: 0.92, gap: 0, loop: false};
export function reviewHtml(content) {
 if (!reviewSupported(content)) return '';
 return `<section class="audio-review" aria-labelledby="review-heading"><p class="kicker">NGHE ÔN BÀI</p><h3 id="review-heading">Rảnh tay, nghe lại bài</h3>
 <p>Từ mới và hội thoại dùng audio sách (giọng người thật); phần còn lại dùng giọng máy của thiết bị. Bấm một lần để nghe liên tục.</p>
 <div class="review-modes"><button class="btn" data-review-mode="quick">Ôn nhanh<small>Ý chính ngữ pháp + 1 câu mẫu</small></button><button class="btn" data-review-mode="detail">Ôn chi tiết<small>${escape(reviewDetailLabel(content))}</small></button></div>
 <div class="review-caption"><span data-review-label></span><span data-review-count></span></div>
 <progress class="review-progress" data-review-progress max="1" value="0" aria-label="Tiến độ nghe"></progress>
 <div class="review-transcript" data-review-text aria-label="Lời đọc và nghĩa"></div>
 <p data-review-status class="review-status" role="status" aria-live="polite"></p>
 <div class="row-actions review-controls"><button class="btn" data-review-action="prev" aria-label="Nghe mục trước">← Trước</button><button class="btn primary" data-review-action="play">▶ Phát</button><button class="btn" data-review-action="next">Sau →</button><button class="btn" data-review-action="stop">Dừng</button></div>
 <div class="row-actions"><label>Tốc độ <select data-review-rate><option value="0.8">0,8×</option><option value="0.92" selected>Vừa phải · 0,92×</option><option value="1">1×</option><option value="1.2">1,2×</option></select></label><label>Nghỉ giữa ý <select data-review-gap><option value="0" selected>Tự nhiên theo dấu câu</option><option value="1">Ít nhất 1 giây</option><option value="3">3 giây · nhắc lại</option></select></label><label><input type="checkbox" data-review-loop> Lặp cả bài ôn</label></div>
 <p class="muted small">Nếu không nghe được trong ứng dụng ChatGPT, hãy mở link bằng Chrome. Giữ trang mở khi nghe. Khóa màn hình hoặc chuyển ứng dụng có thể ngắt giọng đọc. Tiếp tục sẽ đọc lại lượt đang dở.</p>
 <details><summary>Xem nội dung và nguồn bản ôn</summary><p>Sắp xếp từ nội dung đã có trong bài; phần tiếng Việt là chú giải biên tập. Từ mới và từng câu hội thoại phát đúng đoạn audio sách Baulchino (phát trực tuyến, không tải về máy); nghĩa tiếng Việt, phần giải thích ngữ pháp và các câu mẫu chưa có audio riêng được đọc bằng giọng máy của thiết bị. Nếu một đoạn audio sách không phát được, máy sẽ đọc thay bằng giọng máy. Mẫu câu có dấu cộng và ký hiệu vẫn hiện đầy đủ trên màn hình, nhưng khi đọc sẽ nghe lời giải thích bằng tiếng Việt, không đọc nối các ký hiệu. Không đọc tên dấu và ký hiệu; nghỉ ngắn sau dấu phẩy, lâu hơn sau dấu chấm và chuyển ý; chú thích nguồn được lọc theo quy tắc, không tự bỏ từ vựng của bài. Ôn chi tiết tập trung từ vựng, ngữ pháp và hội thoại; luyện nét chữ ở khu Luyện viết.</p><ol data-review-script></ol></details></section>`;
}
function refresh(s) {
 const root = document.querySelector('.audio-review'); if (!root) return;
 const row = s.queue[s.index];
 const currentIndex = Math.min(s.index, s.queue.length - 1);
 root.querySelector('[data-review-status]').textContent = s.error || ({idle:'Sẵn sàng nghe',starting:'Đang khởi động…',playing:'Đang nghe · phần tô màu',paused:'Tạm dừng',ended:'Đã nghe xong'})[s.status];
 root.querySelector('[data-review-label]').textContent = row?.label || '';
 root.querySelector('[data-review-count]').textContent = `${Math.max(0,currentIndex+1)} / ${s.queue.length}`;
 const progress = root.querySelector('[data-review-progress]'); progress.max = s.queue.length || 1; progress.value = s.status === 'ended' ? s.queue.length : Math.max(0,currentIndex);
 const groupRows = s.queue.map((r,i) => ({...r,index:i})).filter(r => r.group === row?.group);
 const paragraphs = [...new Set(groupRows.map(r => r.paragraph))];
 root.querySelector('[data-review-text]').innerHTML = paragraphs.map(paragraph => {
  const parts = groupRows.filter(r => r.paragraph === paragraph);
  const chinese = parts.every(r => r.lang === 'zh-CN');
  const mixed = parts.some(r => r.lang === 'zh-CN') && !chinese;
  return `<div class="review-paragraph ${chinese ? 'review-chinese' : 'review-vietnamese'}"><span class="review-language">${chinese ? 'TIẾNG TRUNG' : mixed ? 'GIẢI THÍCH' : 'TIẾNG VIỆT'}</span><p>${parts.map(r => `<span lang="${r.lang}" class="${r.index === currentIndex ? 'review-active' : ''}" ${r.index === currentIndex ? 'aria-current="true"' : ''}>${escape(r.displayText ?? r.text)}</span>`).join('')}</p></div>`;
 }).join('');
 root.querySelector('[data-review-action="play"]').textContent = ['playing','starting'].includes(s.status) ? 'Ⅱ Tạm dừng' : s.status === 'ended' ? '↻ Nghe lại' : '▶ Phát';
 root.querySelectorAll('[data-review-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.reviewMode === mode)));
 root.querySelector('[data-review-action="prev"]').disabled = s.index <= 0;
 root.querySelector('[data-review-action="next"]').disabled = s.index >= s.queue.length-1;
}
export function mountReview(content, pauseBook) {
 const root = document.querySelector('.audio-review'); if (!root) return;
 if (!controller) {
  controller = createReviewPlayer({synth: window.speechSynthesis, Utterance: window.SpeechSynthesisUtterance, beforePlay: pauseBook, changed: refresh, audioFactory: () => new Audio()});
  window.addEventListener('hsk-audio-start', () => controller.stop());
  window.addEventListener('pagehide', () => controller.stop());
 }
 const sameContent = currentContent === content;
 currentContent = content;
 const load = () => { const rows = buildReview(currentContent, mode); controller.load(rows); root.querySelector('[data-review-script]').innerHTML = rows.map(r => `<li lang="${r.lang}">${escape(r.text)}</li>`).join(''); };
 if (!sameContent || !controller.state().queue.length) load();
 else { refresh(controller.state()); root.querySelector('[data-review-script]').innerHTML = controller.state().queue.map(r => `<li lang="${r.lang}">${escape(r.text)}</li>`).join(''); }
 root.querySelector('[data-review-rate]').value = String(options.rate);
 root.querySelector('[data-review-gap]').value = String(options.gap);
 root.querySelector('[data-review-loop]').checked = options.loop;
 root.querySelectorAll('[data-review-mode]').forEach(b => b.onclick = () => { mode = b.dataset.reviewMode; load(); });
 root.querySelectorAll('[data-review-action]').forEach(b => b.onclick = () => {
  const action = b.dataset.reviewAction;
  if (action === 'play') controller.toggle();
  else if (action === 'stop') load();
  else controller.move(action === 'next' ? 1 : -1);
 });
 const configure = () => { options = {rate: Number(root.querySelector('[data-review-rate]').value), gap: Number(root.querySelector('[data-review-gap]').value), loop: root.querySelector('[data-review-loop]').checked}; controller.configure(options); };
 root.querySelectorAll('select,input').forEach(el => el.onchange = configure);
 configure();
}
export function stopReview() { controller?.stop(); }
