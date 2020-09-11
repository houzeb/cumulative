Vue.directive('clickoutside', {
  bind: function(el, binding, vnode) {
    function documentHandler (e) {
      if (el.contains(e.target)) {
        return false;
      }
      if (binding.expression) {
        binding.value(e);
      }
    }
    function keyDownHandler (e) {
      if (!binding.modifiers.esc || e.keyCode != 27) {
        return false;
      }
      if (binding.expression) {
        binding.value(e);
      }
    }
    el.__vueClickOutSide__ = documentHandler;
    el.__vueKeyDownOutSide__ = keyDownHandler;
    document.addEventListener('click', documentHandler);
    document.addEventListener('keydown', keyDownHandler);
  },
  update: function(el, binding, vnode) {
    if (binding.value == binding.oldValue) {
      return false;
    }
    return true;
  },
  unbind: function (el, binding) {
    document.removeEventListener('click', el.__vueClickOutside__);
    document.removeEventListener('keydown', el.__vueKeyDownOutSide__);
    delete el.__vueClickOUtSide__;
    delete el.__vueKeyDownOutSide__;
  }
});
