const dnd = require('../index');
var chai = require('chai')
  , expect = chai.expect
  , should = chai.should();

describe('Drag and Drop out', function() {
    
    it('should load module', function() {
        should.exist(dnd);
    });
});