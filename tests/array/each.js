define(
    [
        "array/each"
    ], 
    function(array) {
    
        var root = this;
        
        module("array/each | each()");
        
        test("basics", function() {
            var sum;
            
            sum = 0;
            array.each([], function() { sum++; });
            ok(sum === 0);
        
            sum = 0;
            array.each([null], function() { sum++; });
            ok(sum === 1);
        
            sum = 0;
            array.each([null, null], function() { sum++; });
            ok(sum === 2);
        });
    
        test("this context", function() {
            var obj = {};
            
            array.each([null], function() {
                ok(this === root);
            });
            
            array.each([null], function() {
                ok(this === obj);
            }, obj);
        });
        
        test("value argument", function() {
            var values = [
                    undefined,
                    null,
                    0,
                    1,
                    Math.PI,
                    {},
                    [],
                    function() {}],
                i = 0;
        
            array.each(values, function(value) {
                ok(value === values[i]);
                i++;
            });
        });
    
        test("index argument", function() {
            var i;
        
            i = 0;
            array.each([null], function(value, index) {
                ok(index === i);
                i++;
            });
        
            i = 0;
            array.each([null], function(value, index) {
                ok(index === i);
                i++;
            });
        });
        
        test("array argument", function() {
            var values;
            
            values = [null];
            array.each(values, function(value, index, array) {
                ok(array === values);
            });
            
            values = [null, null];
            array.each(values, function(value, index, array) {
                ok(array === values);
            });
        });
    }
);
