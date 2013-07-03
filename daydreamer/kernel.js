define(
    [],
    function() {
        
        // The DayDreamerJS kernel. Here, we define the common functionality
        // that is needed to bootstrap the has.js implementation and the
        // language normalizations.
        // 
        // This is also used as an internal module to share functionality
        // amongst modules that will load sequentially due to their
        // dependencies.
        //
        // This should be considered an internal API, highly subject to change.
        var
            kernel = {};
        
        // Exports.
        return kernel;
    }
);
