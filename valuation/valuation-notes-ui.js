/* Keep special-note bullets visually light in the editor as well as the report. */
(() => {
  const notesInput = document.getElementById('specialNotes');
  if (!notesInput) return;

  const normalizeBullets = (value) => String(value ?? '').replace(/(^|\n)(\s*)■\s*/g, '$1$2▪ ');
  const nativeValue = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');

  if (nativeValue?.get && nativeValue?.set) {
    Object.defineProperty(notesInput, 'value', {
      configurable: true,
      get() {
        return nativeValue.get.call(this);
      },
      set(value) {
        nativeValue.set.call(this, normalizeBullets(value));
      },
    });
  }

  notesInput.addEventListener('input', () => {
    const before = notesInput.value;
    const after = normalizeBullets(before);
    if (before === after) return;

    const start = notesInput.selectionStart;
    const end = notesInput.selectionEnd;
    nativeValue?.set.call(notesInput, after);
    notesInput.setSelectionRange(start, end);
  });
})();
