# Contributing

Thanks for wanting to add something to awesome-shadcn/ui. This page is the full
set of rules a submission is judged by — nothing is checked that isn't written
here.

## Two ways to submit

**The website.** [awesomeshadcn.dev](https://awesomeshadcn.dev/) has a form that
opens the pull request for you: it picks the section, inserts the row in the
right place, and rejects a duplicate before you spend time on it. This is the
recommended route.

**A pull request.** Edit `README.md` directly and follow the format below.

Either way, one resource per pull request.

## What gets accepted

A resource has to clear all five.

**It is about shadcn/ui.** A registry you can install from, a port, a plugin, a
tool built for shadcn projects, or an app whose interface is genuinely built on
shadcn/ui. "Uses shadcn somewhere in the stack" is not enough — if the
description could drop the word shadcn and still make sense, the resource
probably belongs somewhere else.

**It is free to use.** Open source is the norm here. Freemium is fine when the
free tier is genuinely usable on its own — most registries in this list work
that way, and several are open-core with an MIT base. What does not get in is a
product that is paid end to end, with no free tier and no public code. If your
project has a paid tier, say so in the description rather than describing the
paid catalog as if all of it were free.

**The link works and is the right one.** Point at the project — its site, its
repository, its registry. Not a landing page for something else, not a docs
repo standing in for the project, not a link that redirects through a tracker.
A weekly job checks every link in this list and opens an issue for the broken
ones; entries that stay broken are removed.

**The description says what it is.** One sentence, concrete, in English. A
reader should be able to tell whether they want it without opening the link.
A list of technologies is not a description.

**It isn't already listed.** Names and URLs must be unique across the whole
README, not just within a section. The duplicate check runs in CI and fails the
build.

## The row format

```markdown
| Name | Description | [Link](https://example.com) |
```

Three columns, one line, and that is the whole format.

**Don't write a Date cell.** The table has a fourth column, but you leave it off
entirely — no date, and no trailing `|  |` either. A workflow appends it when
your change lands on `main`, and it only fills cells that are empty, so a date
you write yourself survives the merge and permanently records the wrong day.

**Keep the section alphabetical.** Comparison ignores case and any leading
punctuation, so `_cn` sorts under `c` and `.NET` under `n`.

**No extra links inside the description.** If you want to show a demo, make it
the main link or leave it out.

## Naming

Use the project's own name, lowercase: `shadcn-svelte`, `tetra-ui`, `beui`. Keep
the project's own casing when the brand is a proper noun that would look wrong
lowercased.

**Ports are the exception.** There, the Name column works as an index — people
scan it for their language, not for a product name. So a port is named
`Language (project)`:

```markdown
| Svelte (shadcn-svelte) | Svelte port of shadcn/ui. | [Link](...) |
| React Native (tetra-ui) | ... | [Link](...) |
```

A port that isn't tied to one language — `Basecoat`, `Franken UI` — just uses
its own name.

## Sections

| Section | What belongs there |
| --- | --- |
| Libs and Components | Component libraries and individual components built on or for shadcn/ui |
| Registries | Anything installable with `npx shadcn add` from its own registry |
| Plugins and Extensions | Editor extensions, CLI plugins, integrations |
| Colors and Customizations | Themes, palettes, token generators |
| Animations | Motion-focused components and effects |
| Tools | Generators, audits, converters, anything you run rather than install |
| Websites and Portfolios | Sites worth looking at, built with shadcn/ui |
| Platforms | Full applications whose interface is built on shadcn/ui |
| Ports | shadcn/ui rebuilt for another language or framework |
| Design System | Design resources: Figma kits, system documentation |
| Boilerplates / Templates | Starters you clone to begin a project |

Adding a new section means updating the README and the table of contents in the
same pull request.

## What happens after you open it

Three workflows run on your pull request and on `main`:

- **Format README** normalizes table spacing and fails if any name or URL is
  duplicated, or if a row has no usable link — an empty Link cell, or columns
  shifted so that prose landed in it. On pull requests from a fork it can only
  report — it cannot push the formatting back to your branch, so fix anything it
  flags yourself.
- **Add Dates** stamps the Date column after your change lands on `main`.
- **Link Check** runs weekly across the whole list and reports broken links in
  an issue. False positives — sites that block bots but work in a browser — go
  in `.lycheeignore`.

A pull request that fails the duplicate check or points at a dead link won't be
merged until it's fixed. Everything else is a judgment call, and the five rules
above are the ones being applied.

## Working on the website

The site in this repository is a separate concern from the list itself. See
[DEVELOPMENT.md](DEVELOPMENT.md) for setup, architecture, and configuration.
