/**
 * The focus method is only present on HTMLElement instances,
 * so this convenience method simplifies dealing with different types.
 */
function focus(el: unknown) {
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

/**
 * When pressing a letter (A-Z or a-z) then:
 *
 * - Moves focus to the next menu item with a label that starts with the typed character if such an menu item exists.
 * - Otherwise, focus does not move.
 */
export function focusNextMatch(container: HTMLElement, key: string) {
  if (!/[a-z]/i.test(key)) {
    return;
  }

  const letter = key.toLowerCase();

  /**
   * The menu items in the menu.
   */
  const items = Array.from(container.querySelectorAll('li'));

  /**
   * The index of the currently focused menu item.
   */
  const activeIndex = items.indexOf(document.activeElement as HTMLLIElement);

  /**
   * The next menu item that matches the typed character.
   */
  let match: HTMLElement | undefined;

  // Initially search only the items after the currently selected one.
  match = items
    .slice(activeIndex + 1)
    .find((item) => item.textContent?.toLowerCase().startsWith(letter));

  // If there was no match found, wrap-around and search from the beginning.
  if (match === undefined) {
    match = items.find((item) => item.textContent?.toLowerCase().startsWith(letter));
  }

  // Focus the match if one was found.
  if (match !== undefined) {
    match.focus();
  }
}
