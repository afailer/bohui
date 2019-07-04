export const getSuperMap = () => {
  return {
    set: function (key, obj) {
      this.keys.add(String(key))
      this.objs.push({
        key: String(key),
        val: obj
      })
    },
    get: function (key) {
      if (this.keys.has(key)) {
        const vals = []
        this.objs.forEach(o => {
          if (o.key === String(key)) {
            vals.push(o.val)
          }
        });
        return vals
      } else {
        return [];
      }
    },
    getForFunc: function (key, fun) {
      this.get(key).forEach(o => {
        fun(o) ;
      })
    },
    keys: new Set(),
    objs: []
  }
}
