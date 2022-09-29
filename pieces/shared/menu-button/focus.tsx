function focus(el?: Element | null) {
  if (el instanceof HTMLElement) {
    el.focus();
  }
}

export function focusFirstItem(el: Element | null) {
  focus(el?.firstElementChild);
}

export function focusLastItem(el: Element | null) {
  focus(el?.lastElementChild);
}

export function focusNextItem(el: Element | null) {
  const active = el?.querySelector('[tabindex="0"]');
  if (active?.nextElementSibling) {
    focus(active.nextElementSibling);
  } else {
    focusFirstItem(el);
  }
}

export function focusPrevItem(el: Element | null) {
  const active = el?.querySelector('[tabindex="0"]');
  if (active?.previousElementSibling) {
    focus(active.previousElementSibling);
  } else {
    focusLastItem(el);
  }
}
