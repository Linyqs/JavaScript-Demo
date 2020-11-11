let App = {};
App.namespace = function(name){
  let parts = name.split('.');
  let current = App;
  for(let i in parts) {
    if(!current[parts[i]]) {
      current[parts[i]] = {};
    }
    current = current[parts[i]];
  }
}
App.namespace("dom.style");
console.log(App)