var app = new Vue({
  el: '#app',
  data: {
    items: [],
    text: '',
    show: 'all',
    drag: {},
  },
  computed: {
    activeItems: function() {
      return this.items.filter(function(item) {
	return !item.completed;
      });
    },
    filteredItems: function() {
      if (this.show === 'active')
	return this.items.filter(function(item) {
	  return !item.completed;
	});
      if (this.show === 'completed')
	return this.items.filter(function(item) {
	  return item.completed;
	});
      return this.items;
    },
  },
  methods: {
    addItem: function() {
      this.items.push({text: this.text,completed:false});
      this.text = '';
    },
    completeItem: function(item) {
      item.completed = !item.completed;
    },
    deleteItem: function(item) {
      var index = this.items.indexOf(item);
      if (index > -1)
	this.items.splice(index,1);
    },
    showAll: function() {
      this.show = 'all';
    },
    showActive: function() {
      this.show = 'active';
    },
    showCompleted: function() {
      this.show = 'completed';
    },
    deleteCompleted: function() {
      this.items = this.items.filter(function(item) {
	return !item.completed;
      });
    },
    dragItem: function(item) {
      this.drag = item;
    },
    dropItem: function(item) {
      var indexItem = this.items.indexOf(this.drag);
      var indexTarget = this.items.indexOf(item);
      this.items.splice(indexItem,1);
      this.items.splice(indexTarget,0,this.drag);
    },
  }
});
