var app = new Vue({
  el: '#app',
  data: {
    items: [],
    text: '',
    show: 'all',
    drag: {},
    picked: 1,
    order: '',
  },
  created: function(){
    this.getItems();
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
      axios.post("/api/items", {
        text: this.text,
        priority: this.picked,
        completed: false
      }).then(response => {
        this.text = "";
        this.getItems();
        return true;
      }).catch(err => {});
    },
    completeItem: function(item) {
      axios.put("/api/items/" + item.id, {
        text: item.text,
        priority: item.priority,
        completed: !item.completed,
        orderChange: false,
      }).then(response => {
        return true;
      }).catch(err => {});
    },
    deleteItem: function(item) {
      axios.delete("/api/items/" + item.id).then(response => {
        this.getItems();
        return true;
      }).catch(err => {});
    },
    increasePriority: function(item) {
      if (item.priority < 3) item.priority += 1;
      axios.put("/api/items/" + item.id, {
        text: item.text,
        priority: item.priority,
        completed: item.completed
      }).then(response => {
        this.getItems();
        return true;
      }).catch(err => {});
    },
    decreasePriority: function(item) {
      if (item.priority > 1) item.priority -= 1;
      axios.put("/api/items/" + item.id, {
        text: item.text,
        priority: item.priority,
        completed: item.completed
      }).then(response => {
        this.getItems();
        return true;
      }).catch(err => {});
    },
    sortByPriority: function(){
      var sortFunc;
      if (this.order === ''){
        sortFunc = (a,b) => {
          if (a.priority > b.priority) return 1;
          else if (a.priority < b.priority) return -1
          else return a.text < b.text ? -1 : a.text > b.text
        };
        this.order = '^';
      } else if (this.order === '^') {
        sortFunc = (a,b) => {
          if (a.priority < b.priority) return 1;
          else if (a.priority > b.priority) return -1
          else return a.text < b.text ? -1 : a.text > b.text
        };
        this.order = 'v';
      } else {
        this.getItems();
        this.order = '';
      }
      this.items.sort(sortFunc);
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
      this.items.forEach(item => {
	if (item.completed)
	  this.deleteItem(item)
      });
    },
    dragItem: function(item) {
      this.drag = item;
    },
    dropItem: function(item) {
      axios.put("/api/items/" + this.drag.id, {
        text: this.drag.text,
        completed: this.drag.completed,
        orderChange: true,
        orderTarget: item.id
      }).then(response => {
        this.getItems();
        return true;
      }).catch(err => {});
    },
    getItems: function(){
      axios.get("/api/items").then(response => {
        this.items = response.data;
        return true;
      }).catch(err => {});
    },
  }
});
