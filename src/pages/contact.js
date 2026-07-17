import { h } from '../utils/dom.js';
import { Button } from '../components/button.js';

/**
 * Encode form fields the way a standard HTML form submission would, so
 * this can be posted to a form-handling backend (e.g. Netlify Forms,
 * or any endpoint expecting application/x-www-form-urlencoded).
 */
function encodeForm(fields) {
  return Object.entries(fields)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

/**
 * Submits the contact form without navigating away. Points at "/" with a
 * form-name field, matching the static `<form name="contact">` stub in
 * index.html (see that file's comment) — swap this for a real API
 * endpoint if one isn't provided by the hosting platform.
 */
async function submitContactForm(fields) {
  const response = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encodeForm({ 'form-name': 'contact', ...fields }),
  });
  if (!response.ok) {
    throw new Error(`Submission failed with status ${response.status}`);
  }
}

export function ContactPage(content) {
  const { site } = content;
  const { heading, blurb } = content.contact;

  const infoSection = h('section', { className: 'contact-info', id: 'hours' }, [
    h('h2', {}, 'Visit Us'),
    h('p', {}, site.address),
    h('p', {}, site.phone),
    h('p', {}, site.email),
    h(
      'ul',
      { className: 'hours-list' },
      site.hours.map((h1) => h('li', {}, `${h1.days}: ${h1.time}`))
    ),
  ]);

  const feedback = h('div', { className: 'form-feedback', role: 'status' });

  const nameInput = h('input', { type: 'text', name: 'name', required: true, id: 'contact-name' });
  const emailInput = h('input', { type: 'email', name: 'email', required: true, id: 'contact-email' });
  const messageInput = h('textarea', { name: 'message', required: true, id: 'contact-message', rows: 5 });

  const submitButton = Button({ label: 'Send Message', type: 'submit' });

  const form = h(
    'form',
    {
      className: 'contact-form',
      onSubmit: async (event) => {
        event.preventDefault();
        submitButton.setAttribute('disabled', '');
        feedback.replaceChildren(h('p', { className: 'form-feedback__pending' }, 'Sending…'));

        try {
          await submitContactForm({
            name: nameInput.value,
            email: emailInput.value,
            message: messageInput.value,
          });
          feedback.replaceChildren(
            h('p', { className: 'form-feedback__success' }, 'Thanks — we\u2019ll get back to you soon.')
          );
          form.reset();
        } catch (err) {
          feedback.replaceChildren(
            h(
              'p',
              { className: 'form-feedback__error' },
              'Something went wrong sending your message. Please try again or call us directly.'
            )
          );
        } finally {
          submitButton.removeAttribute('disabled');
        }
      },
    },
    [
      h('label', { for: 'contact-name' }, 'Name'),
      nameInput,
      h('label', { for: 'contact-email' }, 'Email'),
      emailInput,
      h('label', { for: 'contact-message' }, 'Message'),
      messageInput,
      submitButton,
      feedback,
    ]
  );

  const formSection = h('section', { className: 'contact-form-section', id: 'form' }, [
    h('h2', {}, heading),
    h('p', {}, blurb),
    form,
  ]);

  return h('div', { className: 'page page--contact' }, [
    h('header', { className: 'page-header' }, [h('h1', {}, 'Contact')]),
    infoSection,
    formSection,
  ]);
}
