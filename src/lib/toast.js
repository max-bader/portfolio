/**
 * One line of confirmation, for the two actions whose result is invisible:
 * copying an address, and switching appearance from the palette. Anything
 * that visibly changed the page does not get one.
 *
 * A module-level slot rather than context: both callers sit at opposite ends
 * of the tree, and threading a provider through for one string is not worth
 * the wiring.
 */

let announce = () => {};

export const notify = (message) => announce(message);

export const onNotify = (handler) => {
  announce = handler;
  return () => {
    announce = () => {};
  };
};
