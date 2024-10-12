---
title: Modals | Components | Buttery Tools
meta:
  - type: name
    name: description
    content: A collection of modal dialog components designed to easily and imperatively control blocking UI dialogs.
---

# Modals

The semantics of a dialog specifically state that a `<dialog />` can either be a **modal** or **non-modal** dialog.
In order to reduce confusion on what to use when, the `<Modal />` component should be used when you want to explicitly stop
the user from their flow to do something else that is contained in the modal that is being launched.

This library exercises the opinion that all non-modal dialogs should be controlled using the `Popover API`. All Modals
are blocking elements and should be treated as such. In addition, all modals expecting to receive `modalRef` will surface
modal dialogs which cause the rest of the page to become inert.
