// Generated by CoffeeScript 1.10.0

/* public/js/models.js */
var Sticky, StickyManager;

StickyManager = (function() {
  StickyManager.prototype.stickyList = [];

  function StickyManager(stickyData) {
    var i, len, ref, sticky, x, y;
    if (stickyData == null) {
      stickyData = [];
    }
    for (i = 0, len = stickyData.length; i < len; i++) {
      sticky = stickyData[i];
      ref = [sticky.xs * window.innerWidth, sticky.ys * window.innerHeight], x = ref[0], y = ref[1];
      this.stickyList.push(new Sticky(sticky.content, x, y));
    }
  }

  StickyManager.prototype.addSticky = function() {
    var ref, sticky, x, y;
    ref = [button.position().left - 145, button.position().top - 145], x = ref[0], y = ref[1];
    sticky = new Sticky('', x, y);
    this.stickyList.push(sticky);
    return sticky.sticky.dblclick();
  };

  StickyManager.prototype.removeSticky = function(sticky) {
    return this.stickyList.splice(this.stickyList.indexOf(sticky.destroy(), 1));
  };

  StickyManager.prototype.data = function() {
    var i, len, ref, results, sticky;
    ref = this.stickyList;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      sticky = ref[i];
      results.push(sticky.data());
    }
    return results;
  };

  return StickyManager;

})();

Sticky = (function() {
  function Sticky(content, x, y) {
    this.content = content;
    this.editMode = false;
    this.sticky = $('<sticky>').draggable().css({
      left: x + 'px',
      top: y + 'px',
      position: 'fixed'
    }).append(this.stickyDiv = $('<div>', {
      "class": 'card yellow lighten-2'
    }).css({
      height: '100%'
    }).append(this.contentDiv = $('<div>', {
      "class": 'card-content black-text'
    }).css({
      height: '100%'
    }).append(this.textTag = $('<p>').css({
      height: '100%'
    }).text(this.content))));
    this.textEntry = $('<div>').css({
      height: '100%'
    });
    new Medium({
      element: this.textEntry.get(0),
      mode: Medium.partialMode,
      autofocus: true
    });
    this.sticky.dblclick((function(_this) {
      return function(event) {
        if (_this.editMode) {
          _this.sticky.draggable('enable');
          _this.stickyDiv.removeClass('lighten-4');
          _this.stickyDiv.addClass('lighten-2');
          _this.textEntry.detach();
          _this.content = _this.textEntry.text();
          _this.textTag.text(_this.content);
          _this.contentDiv.append(_this.textTag);
          return _this.editMode = false;
        } else {
          _this.sticky.draggable('disable');
          _this.stickyDiv.removeClass('lighten-2');
          _this.stickyDiv.addClass('lighten-4');
          _this.content = _this.textTag.text();
          _this.textTag.detach();
          _this.textEntry.text(_this.content);
          _this.contentDiv.append(_this.textEntry);
          _this.textEntry.focus();
          return _this.editMode = true;
        }
      };
    })(this));
    $(document.body).append(this.sticky);
  }

  Sticky.prototype.data = function() {
    return {
      content: this.content,
      xs: this.sticky.position().left / window.innerWidth,
      ys: this.sticky.position().top / window.innerHeight
    };
  };

  Sticky.prototype.destroy = function() {
    return this.sticky.remove();
  };

  return Sticky;

})();
