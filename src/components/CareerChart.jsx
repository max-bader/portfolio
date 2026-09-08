import React, { useRef } from 'react';
import { gsap, motionContext, useGSAP } from '../lib/gsap';
import {
  axisTicks,
  careerEnd,
  careerStart,
  laneCount,
  peakConcurrent,
  roles,
  totalMonths
} from '../lib/timeline';

/**
 * The range claim, drawn.
 *
 * Six roles inside eighteen months is the one fact a neighbouring student
 * portfolio cannot copy, and it is the fact a list of six entries hides: read
 * top to bottom, concurrency looks like sequence. Packed into lanes it is
 * visible in one glance — three bars deep at the busiest month.
 *
 * Every number here is computed from the dates in `experience.js`. Nothing in
 * this chart can drift from the CV under it because nothing in it is typed by
 * hand.
 */

const lanes = Array.from({ length: laneCount }, (_, lane) =>
  roles.filter((role) => role.lane === lane)
);

const CareerChart = ({ focused, onFocus, onSelect }) => {
  const root = useRef(null);

  useGSAP(
    () => {
      motionContext(root, (context) => {
        const trigger = { trigger: root.current, start: 'top 80%', once: true };

        if (!context.conditions.motion) {
          // Reduced motion still gets the drawing, just already drawn.
          gsap.set('.rf-range-bar', { opacity: 1 });
          return;
        }

        // Bars grow from where the role started, in the order the roles began,
        // so the plot reads as a career accumulating rather than six shapes
        // appearing. Timing is by start date, not by DOM order.
        // The empty tracks arrive first, so the bars have somewhere to grow
        // into rather than inventing the plot as they go.
        gsap.from('.rf-range-lane', {
          scaleX: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.06,
          clearProps: 'transform',
          scrollTrigger: trigger
        });

        gsap.from('.rf-range-bar', {
          scaleX: 0,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: { each: 0.07, from: 'start' },
          delay: 0.25,
          // Handed back to CSS afterwards: the hover and lit states are
          // outlines precisely so nothing here has to survive.
          clearProps: 'transform,opacity',
          scrollTrigger: trigger
        });

        gsap.from('.rf-range-rule', {
          opacity: 0,
          duration: 0.5,
          delay: 0.5,
          ease: 'power2.out',
          scrollTrigger: trigger
        });

        // Counters. Snapped to integers so no frame shows 4.7 roles.
        gsap.utils.toArray('.rf-stat-value').forEach((el) => {
          const target = Number(el.dataset.value);
          const box = { n: 0 };
          gsap.to(box, {
            n: target,
            duration: 1.1,
            delay: 0.1,
            ease: 'power2.out',
            snap: { n: 1 },
            onUpdate: () => {
              el.textContent = String(Math.round(box.n));
            },
            scrollTrigger: trigger
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <div className="rf-range rf-reveal" ref={root}>
      <dl className="rf-range-stats">
        <div>
          <dd className="rf-stat-value" data-value={roles.length}>
            {roles.length}
          </dd>
          <dt>roles</dt>
        </div>
        <div>
          <dd className="rf-stat-value" data-value={totalMonths}>
            {totalMonths}
          </dd>
          <dt>months</dt>
        </div>
        <div>
          <dd className="rf-stat-value" data-value={peakConcurrent}>
            {peakConcurrent}
          </dd>
          <dt>at once</dt>
        </div>
      </dl>

      <div className="rf-range-plot">
        {axisTicks.map((tick) => (
          <span
            className="rf-range-rule"
            key={tick.label}
            style={{ left: `${tick.at * 100}%` }}
            aria-hidden="true"
          >
            <em>{tick.label}</em>
          </span>
        ))}

        {lanes.map((lane, index) => (
          <div className="rf-range-lane" key={index}>
            {lane.map((role) => (
              <button
                type="button"
                className="rf-range-bar"
                key={role.id}
                data-role={role.id}
                data-lit={focused === role.id || undefined}
                data-now={role.ongoing || undefined}
                style={{ left: `${role.x * 100}%`, width: `${role.w * 100}%` }}
                onPointerEnter={() => onFocus(role.id)}
                onPointerLeave={() => onFocus(null)}
                onFocus={() => onFocus(role.id)}
                onBlur={() => onFocus(null)}
                onClick={() => onSelect(role.id)}
              >
                <span>{role.short}</span>
                <em className="rf-sr">
                  {role.role} at {role.company}, {role.date}
                </em>
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="rf-range-axis" aria-hidden="true">
        <span>{careerStart}</span>
        <span>{careerEnd}</span>
      </div>
    </div>
  );
};

export default CareerChart;
