export default Ember.Component.extend({
	init() {
		this._super();

		Ember.defineProperty( this, 'isListEmpty', Ember.computed( 'events', () => {
  		
  		if(this.events) {
  			return false;
  		}

  		return true;
  	}));
	}
});