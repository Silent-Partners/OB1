# Product

## Register

product

## Users

A small internal team at Silent Partners using Open Brain as a shared "second
brain." Primary user is the operator capturing thoughts, tasks, references, and
decisions throughout the day, then returning to browse, search, and review what
the system has classified and embedded. Context is daily, low-ceremony, often
mid-task: capture something quickly, glance at what's accumulated, find a past
thought. Trusted/internal, but occasionally seen by teammates, so it should feel
finished and on-brand — not a personal scratchpad.

## Product Purpose

A dashboard over the Open Brain memory system (Supabase + pgvector, MCP). It
lets a person add raw text that gets auto-classified into a thought taxonomy
(task, idea, observation, reference, person_note, decision, commitment,
question, bookmark), then browse, search, filter, and manage that growing
corpus. Success is: capture feels effortless, the accumulated knowledge feels
*worth returning to*, and nothing about the interface competes with thinking.

## Brand Personality

Silent Partners editorial. Three words: **calm, considered, warm**. The voice is
that of a well-set publication, not a SaaS tool — typographic craft over
chrome, restraint over decoration. It should feel like *your own* second brain:
personal and human, never corporate. Quiet by default; the one green accent and
the serif display are used sparingly enough that they still mean something.

## Anti-references

- Generic SaaS dashboards: dense KPI tiles, gradient hero metrics, identical
  card grids, "Welcome back 👋" boilerplate.
- Dark-mode developer-tool aesthetic (this is intentionally cream/light).
- Notion/Linear clones — admire their craft, but don't import their look.
- Anything that feels like a CRUD admin panel: bordered boxes everywhere, no
  hierarchy, no rhythm, the screen reading as one flat gray-on-gray surface.

## Design Principles

1. **The tool disappears into the thought.** Calm, focused, low-noise. Nothing
   on screen competes with the user's own thinking.
2. **Hierarchy through type and space, not chrome.** Earn figure/ground with the
   serif display, rules, and rhythm — not by wrapping everything in a card.
3. **One accent means something.** Green is for action, selection, and live
   state only. Spent on decoration, it stops signaling.
4. **Personal, not corporate.** It's a second *brain* — warm, human copy and a
   sense of ownership, not enterprise boilerplate.
5. **Earned familiarity.** Standard affordances done well. Surprise is saved for
   small moments, never imposed on every screen.

## Accessibility & Inclusion

Target WCAG 2.1 AA. Body text ≥ 4.5:1, large/secondary text ≥ 3:1 against the
cream surfaces. Visible, non-color focus states on every interactive element.
All motion gated behind `prefers-reduced-motion`. Type signal never carried by
emoji or color alone — always paired with a text label.
