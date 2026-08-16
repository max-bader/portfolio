import { experienceData } from '../data/experience';

/**
 * Turns the "6/26 - Present" strings in experience.js into real numbers.
 *
 * Every world's geometry is computed from these — bar lengths, lane
 * assignments, dimension callouts. Motion that encodes the data beats motion
 * applied on top of it, and it means the drawing cannot drift from the résumé.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "6/26" -> absolute month index. Two-digit years are 2000s. */
const parseStamp = (stamp) => {
  const trimmed = stamp.trim();
  if (/present/i.test(trimmed)) {
    const now = new Date();
    return now.getFullYear() * 12 + now.getMonth();
  }
  const [month, year] = trimmed.split('/').map(Number);
  return (2000 + year) * 12 + (month - 1);
};

const formatStamp = (index) =>
  `${MONTHS[index % 12]} ${String(Math.floor(index / 12)).slice(2)}`;

const parsed = experienceData.map((job) => {
  const [from, to] = job.date.split('-');
  const start = parseStamp(from);
  const end = parseStamp(to);
  return {
    ...job,
    start,
    end,
    months: Math.max(1, end - start + 1),
    ongoing: /present/i.test(to)
  };
});

const earliest = Math.min(...parsed.map((job) => job.start));
const latest = Math.max(...parsed.map((job) => job.end));
const span = Math.max(1, latest - earliest);

/**
 * Roles packed into lanes so concurrent ones sit side by side instead of
 * stacking. The lane count is itself the range claim, visualised.
 */
const assignLanes = (jobs) => {
  const laneEnds = [];
  return jobs.map((job) => {
    let lane = laneEnds.findIndex((end) => end < job.start);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(job.end);
    } else {
      laneEnds[lane] = job.end;
    }
    return { ...job, lane };
  });
};

// Oldest first reads as a career, and lane packing needs sorted input.
const chronological = [...parsed].sort((a, b) => a.start - b.start || a.end - b.end);

export const roles = assignLanes(chronological).map((job) => ({
  ...job,
  // 0..1 across the whole career, for bar geometry.
  offset: (job.start - earliest) / span,
  extent: Math.max(0.02, (job.end - job.start) / span)
}));

/** Newest first, the order a recruiter expects to read. */
export const rolesNewestFirst = [...roles].sort((a, b) => b.start - a.start);

export const laneCount = Math.max(...roles.map((job) => job.lane)) + 1;
export const totalMonths = latest - earliest + 1;
export const careerStart = formatStamp(earliest);
export const careerEnd = formatStamp(latest);

/** How many roles were running at the busiest moment. */
export const peakConcurrent = (() => {
  let peak = 0;
  for (let m = earliest; m <= latest; m += 1) {
    const active = roles.filter((job) => job.start <= m && job.end >= m).length;
    if (active > peak) peak = active;
  }
  return peak;
})();
