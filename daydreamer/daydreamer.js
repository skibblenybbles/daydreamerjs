define(
    [
        "./array",
        "./function",
        "./has",
        "./language",
        "./object"
    ],
    function(array, fn, has, language, object) {
        return {
            array: array,
            fn: fn,
            has: has,
            language: language,
            object: object
        };
    }
);
