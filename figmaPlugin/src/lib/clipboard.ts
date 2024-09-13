export function writeTextToClipboard(str: string) {
  //const prevActive = document.activeElement;
  const textArea = document.createElement("textarea");

  textArea.value = str;

  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";

  document.body.appendChild(textArea);

  textArea.focus();
  textArea.select();

  return new Promise<void>((res, rej) => {
    document.execCommand("copy") ? res() : rej();
    textArea.remove();

    //prevActive?.focus.();
  });
}

export function readTextFromClipboard() {
  const textArea = document.createElement("textarea");

  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";

  document.body.appendChild(textArea);

  textArea.focus();
  textArea.select();

  return new Promise((res, rej) => {
    document.execCommand("paste") ? res(textArea.value) : rej();
    textArea.remove();
  });
}
