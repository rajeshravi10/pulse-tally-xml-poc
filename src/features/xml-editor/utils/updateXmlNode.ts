export function updateVoucherFieldNode(
  xmlDoc: Document,
  fieldKeyOrTagName: string,
  newValue: string
): void {
  if (!xmlDoc) return;

  const vouchers = xmlDoc.getElementsByTagName
    ? xmlDoc.getElementsByTagName('VOUCHER')
    : null;
  const voucher = vouchers && vouchers.length > 0 ? vouchers[0] : xmlDoc.documentElement;
  if (!voucher) return;

  const targetTag = fieldKeyOrTagName.trim();
  const targetTagUpper = targetTag.toUpperCase();

  // 1. Try finding by exact tag name
  let targetEl: Element | null = null;
  const existing = voucher.getElementsByTagName ? voucher.getElementsByTagName(targetTag) : null;
  if (existing && existing.length > 0) {
    targetEl = existing[0];
  }

  // 2. If not found, search child nodes case-insensitively
  if (!targetEl) {
    const childNodes = Array.from(voucher.childNodes);
    for (const node of childNodes) {
      if (node.nodeType === 1) { // ELEMENT_NODE
        const el = node as Element;
        const name = (el.tagName || el.localName || el.nodeName).toUpperCase();
        if (name === targetTagUpper) {
          targetEl = el;
          break;
        }
      }
    }
  }

  // 3. If still not found, check all descendant elements case-insensitively
  if (!targetEl && voucher.getElementsByTagName) {
    const allDescendants = voucher.getElementsByTagName('*');
    for (let i = 0; i < allDescendants.length; i++) {
      const el = allDescendants[i];
      const name = (el.tagName || el.localName || el.nodeName).toUpperCase();
      if (name === targetTagUpper) {
        targetEl = el;
        break;
      }
    }
  }

  // 4. Update or create element
  if (targetEl) {
    targetEl.textContent = newValue;
  } else {
    // Create new element if not present in the document
    const newEl = xmlDoc.createElement(targetTag);
    newEl.textContent = newValue;

    const vchNums = voucher.getElementsByTagName ? voucher.getElementsByTagName('VOUCHERNUMBER') : null;
    const vchNum = vchNums && vchNums.length > 0 ? vchNums[0] : null;

    if (vchNum && vchNum.nextSibling) {
      voucher.insertBefore(newEl, vchNum.nextSibling);
    } else {
      voucher.appendChild(newEl);
    }
  }
}
