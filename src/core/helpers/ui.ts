export function checkPosition(gen: any, callback: (gen) => void) {
  // Высота документа и экрана
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;
  
  // Сколько пикселей уже проскроллили
  const scrolled = window.scrollY;
  
  // Порог
  const threshold = height - screenHeight / 4;
  
  // Низ экрана относительно страницы
  const position = scrolled + screenHeight;
  
  if (position >= threshold) {
    // Вызываем действие
    callback(gen);
  }
}

export function throttle(callee, timeout) {
  let timer = null;

  return function perform(...args) {
    if (timer) return;

    timer = setTimeout(() => {
      callee(...args);

      clearTimeout(timer);
      timer = null;
    }, timeout);
  };
}