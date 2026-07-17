import { h } from '../utils/dom.js';

/**
 * A single team member card. `anchorId` becomes the element's `id` so it
 * can be deep-linked to directly, e.g. "/about#amara".
 */
export function TeamMember({ anchorId, name, role, bio }) {
  return h('div', { className: 'team-member', id: anchorId }, [
    h('div', { className: 'team-member__avatar', 'aria-hidden': 'true' }),
    h('h4', { className: 'team-member__name' }, name),
    h('p', { className: 'team-member__role' }, role),
    h('p', { className: 'team-member__bio' }, bio),
  ]);
}
