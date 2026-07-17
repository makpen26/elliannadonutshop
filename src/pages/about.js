import { h } from '../utils/dom.js';
import { TeamMember } from '../components/teamMember.js';

export function AboutPage(content) {
  const { story, team } = content.about;

  const storySection = h('section', { className: 'story', id: 'story' }, [
    h('h2', {}, story.heading),
    ...story.paragraphs.map((p) => h('p', {}, p)),
  ]);

  const teamSection = h('section', { className: 'team', id: 'team' }, [
    h('h2', {}, 'Our Team'),
    h(
      'div',
      { className: 'team__grid' },
      team.map((member) =>
        TeamMember({
          anchorId: member.id,
          name: member.name,
          role: member.role,
          bio: member.bio,
        })
      )
    ),
  ]);

  return h('div', { className: 'page page--about' }, [
    h('header', { className: 'page-header' }, [h('h1', {}, 'About Wildflour')]),
    storySection,
    teamSection,
  ]);
}
