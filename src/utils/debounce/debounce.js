function debounce(fn, time) {
  let timeoutId;

  function cancel() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }

  function wrapper(...args) {
    cancel();
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn(...args);
    }, time);
  }

  wrapper.cancel = cancel;

  return wrapper;
}

export default debounce;
